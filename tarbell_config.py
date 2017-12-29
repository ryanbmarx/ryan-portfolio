# -*- coding: utf-8 -*-

"""
Tarbell project configuration
"""

from flask import Blueprint, g, render_template
# import ftfy
from markupsafe import Markup

import jinja2

# For list flattening in get tag list
import operator

blueprint = Blueprint('ryan-portfolio', __name__)

# @blueprint.app_template_global('get_labels')
# @blueprint.app_template_filter()
# @jinja2.contextfilter
@blueprint.app_template_filter('get_tags')
def get_tags(tags, return_html=False):
    if return_html:
        retval = ""
        for t in tags.split(','):
            retval += "<li>#{}</li>".format(t.strip())
        # return Markup(retval)
    else:
        retval = ""
        for t in tags.split(','):
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
        tag_list.append(p['tags'].split(','))
    
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