# -*- coding: utf-8 -*-

"""
Tarbell project configuration
"""

from flask import Blueprint, g
import datetime
import xlrd.xldate
import re

blueprint = Blueprint('midwest-voting-demographics', __name__)

@blueprint.app_template_filter('commas_as_array')
def format_comma_list_as_array(list):
	return list.replace(' ', '').split(',')

# Google spreadsheet key
SPREADSHEET_KEY = "1ciL2GhA7enyXOkIVO6ZCIlR_ORn2Klaegt5EicHoYbs"

# Exclude these files from publication
EXCLUDES = ['*.md', 'requirements.txt', 'node_modules', 'sass', 'js/src', 'package.json', 'Gruntfile.js']

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
    
    "production": "graphics.chicagotribune.com/midwest-voting-demographics",
    "staging": "apps.beta.tribapps.com/midwest-voting-demographics",
}

# Default template variables
DEFAULT_CONTEXT = {
    'name': 'midwest-voting-demographics',
    'title': 'Midwest Voting Demographics'
}