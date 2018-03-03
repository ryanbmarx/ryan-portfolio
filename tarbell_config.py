# -*- coding: utf-8 -*-

"""
Tarbell project configuration
"""

from flask import Blueprint, g, render_template
# import ftfy
from markupsafe import Markup
import jinja2
from tarbell.hooks import register_hook

import operator # For list flattening in get tag list
from github import Github # For generating projects

import os #For the environment variables
import re # regex
import datetime

import requests # For requesting github data
from requests.auth import HTTPBasicAuth # to request topics from github
import json # To parse the api responses

from PIL import Image   # For the image sizing and dimensions

blueprint = Blueprint('ryan-portfolio', __name__)


@blueprint.app_template_filter('get_thumbnail_info')
def get_thumbnail_info(image):
    """
        For SEO metadata, get and return image dimensions
    """

    try:
        im = Image.open(image)
        width,height = im.size
        return {
            "width": width,
            "height": height
        }
    except IOError:
        pass


def get_date_created(user, password, repo_id):
    # https://api.github.com/repos/ryanbmarx/shooting-homicide-victims/commits
    """
    Takes a repo id and returns a two-item list [first, most recent]
    """

    topics_url = "https://api.github.com/repos/{}/{}/commits?sha=master&per_page=100".format(user, repo_id)
    head = {
        "accept":"application/vnd.github.mercy-preview+json"
    }
    authorization = HTTPBasicAuth(user,password)
    response = requests.get(topics_url, headers=head, auth=authorization)
    commits = json.loads(response.content)
    
    # The most recent update always will be first in the list.
    most_recent_commit_date = commits[0]['commit']['author']['date']

    if len(commits) >= 100:
        # If we have more than one page of results, we need to grab the link
        # to the last page. Then repeat this process to get the date if the first
        # commit, which will be the last item on the last page.

        # Start by getting the url of the last page
        url_last = ""
        for link in response.headers['link'].split(','):
            url = link.split(';')
            if "last" in url[1]:
                url_last = url[0].strip().replace("<","").replace('>',"")

        #Then make another request with this new url
        response_last = requests.get(url_last, headers=head, auth=authorization)
        commits_last = json.loads(response_last.content)
        first_commit_date = commits_last[len(commits_last) - 1]['commit']['author']['date']
    else:
        # If we're only doing with one page of results (i.e. no link in header), then 
        # the first commit will be the last item in the list.
        first_commit_date = commits[len(commits) - 1]['commit']['author']['date']
        
    return [
        datetime.datetime.strptime(first_commit_date, "%Y-%m-%dT%H:%M:%SZ"),
        datetime.datetime.strptime(most_recent_commit_date, "%Y-%m-%dT%H:%M:%SZ"),
    ]

def check_for_thumbnail(repo_name_str):
    """
        Takes a repo ID, and formats it to be filename compatible.
        It then checks for both a jpeg, jpg and png locally, returning 
        the version it found. Otherwise it returns the palceholder.
    """
    retval = repo_name_str.lower().strip().replace(" ", "-").replace(".", "").replace("'", "").replace('"', "")
    if os.path.isfile('img/micro-thumbs/' + retval + ".jpg"):
        return "{}.jpg".format(retval)
    elif os.path.isfile('img/micro-thumbs/' + retval + ".jpeg"):
        return "{}.jpeg".format(retval)
    elif os.path.isfile('img/micro-thumbs/' + retval + ".png"):
        return "{}.png".format(retval)
    else:
        return "img/missing.png"

# @register_hook('preview')
@blueprint.app_template_global('generate_projects_list')
def generate_projects_list():
    user = os.environ['github_user']
    password = os.environ['github_password']

    ryanbmarx = Github(user, password)
    repos = ryanbmarx.get_user().get_repos()
    
    repositories = []
    for repo in repos:
        
        # If the repo is owned by me and is not private
        if repo.owner.login == user and not repo.fork:
            
            # Get the topics, which is in preview
            topics_url = "https://api.github.com/repos/{}/{}/topics".format(user, repo.name.lower())
            head = {"accept":"application/vnd.github.mercy-preview+json"}
            authorization = HTTPBasicAuth(user,password)
            response = requests.get(topics_url, headers=head, auth=authorization)
            topics = json.loads(response.content)
            topic_tags = topics["names"]

            # Only pluck data if it is a featured repo
            if "featured" in topic_tags:
                r = {}
                dates = get_date_created(user, password, repo.name.lower())
                r['id'] = repo.name.lower()
                r['name'] = format_name(repo.name)
                r['description'] = repo.description.strip()
                r['repo_url'] = repo.html_url
                r['date_created'] = dates[0]
                r['date_updated'] = dates[1]
                r['prod_url'] = repo.homepage if repo.homepage != "None" else False
                r['thumbnail'] = check_for_thumbnail(repo.name.lower())
                del topic_tags[topic_tags.index('featured')] # remove "featured" from the list
                r['topics'] = topic_tags
                repositories.append(r)
    return repositories

def format_name(name):
    """
    Make nicely-edited, human readable name for the project
    """
    return re.sub("-"," ",name).title()

# @blueprint.app_template_global('get_labels')
# @blueprint.app_template_filter()
# @jinja2.contextfilter
@blueprint.app_template_filter('get_topic_tags')
def get_topic_tags(tags, return_html=False):
    retval = ""
    if return_html:
        for t in tags:
            retval += "<li>#{}</li>".format(t.lower().strip())
    else:
        for t in tags:
            retval += " data-{}".format(t.strip())
    return Markup(retval)

@blueprint.app_template_global('get_tags_list')
def get_tags_list(projects):
    """
    takes the entire projects sheet and creates a unique list of tags. This 
    would be great to make filter buttons from. Just sayin'
    """
    tag_list = []
    for p in projects:
        tag_list.append(p['topics'])
    
    tag_list = reduce(operator.add, tag_list)
    tag_list = list(set(tag_list))
    return tag_list

# Google spreadsheet key
SPREADSHEET_KEY = "16I7B3l2Dew220S_NwCQjTMCnTK9eCbjjlxpbEmA2fGU"

# Exclude these files from publication
EXCLUDES = ['scripts', '_vault', '*.md', 'img/_archive','requirements.txt', 'node_modules', 'sass', 'js/src', 'package.json', 'package-lock.json', 'Gruntfile.js', 'subtemplates', 'data.json']

# Spreadsheet cache lifetime in seconds. (Default: 4)
# SPREADSHEET_CACHE_TTL = 4

# Create JSON data at ./data.json, disabled by default
# CREATE_JSON = True

# Get context from a local file or URL. This file can be a CSV or Excel
# spreadsheet file. Relative, absolute, and remote (http/https) paths can be 
# used.
# CONTEXT_SOURCE_FILE = ""

# EXPERIMENTAL: Path to a credentials file to authenticate with Google Drive.
# This is useful for for automated deployment. This option may be replaced by
# command line flag or environment variable. Take care not to commit or publish
# your credentials file.
# CREDENTIALS_PATH = ""

# S3 bucket configuration
S3_BUCKETS = {
    # Provide target -> s3 url pairs, such as:
    #     "mytarget": "mys3url.bucket.url/some/path"
    # then use tarbell publish mytarget to publish to it
    
    # "production": "graphics.chicagotribune.com/ryan-portfolio",
    # "staging": "apps.beta.tribapps.com/ryan-portfolio",
}

# Default template variables
DEFAULT_CONTEXT = {
    'name': 'ryan-portfolio',
    'title': "Ryan's portfolio",
    "ROOT_URL": "ryanbmarx.com"
}