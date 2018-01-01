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

blueprint = Blueprint('ryan-portfolio', __name__)

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
                r['id'] = repo.name.lower()
                r['name'] = format_name(repo.name)
                r['description'] = repo.description
                r['repo_url'] = repo.html_url
                r['date_created'] = repo.created_at
                r['date_updated'] = repo.updated_at if repo.updated_at != "None" else False
                r['prod_url'] = repo.homepage if repo.homepage != "None" else False

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
EXCLUDES = ['*.md', 'requirements.txt', 'node_modules', 'sass', 'js/src', 'package.json', 'Gruntfile.js', 'subtemplates']

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
    'title': "Ryan's portfolio"
}