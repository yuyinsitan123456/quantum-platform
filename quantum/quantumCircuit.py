from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for,jsonify
)
from werkzeug.exceptions import abort

from quantum.auth import login_required
from quantum.db import get_db
import json
import math
from quantum.sparkTool import sparkTool
from quantum.circuitTool import circuitTool

bp = Blueprint('quantumCircuit', __name__)


@bp.route('/')
def index():
    """Show all the posts, most recent first."""
    db = get_db()
    # posts = db.execute(
    #     'SELECT p.id, title, body, created, author_id, username'
    #     ' FROM post p JOIN user u ON p.author_id = u.id'
    #     ' ORDER BY created DESC'
    # ).fetchall()
    # return render_template('quantumCircuit/quirk.html', posts=posts)
    return render_template('quantumCircuit/quirk.html')


def get_post(id, check_author=True):
    """Get a post and its author by id.

    Checks that the id exists and optionally that the current user is
    the author.

    :param id: id of post to get
    :param check_author: require the current user to be the author
    :return: the post with author information
    :raise 404: if a post with the given id doesn't exist
    :raise 403: if the current user isn't the author
    """
    post = get_db().execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' WHERE p.id = ?',
        (id,)
    ).fetchone()

    if post is None:
        abort(404, "Post id {0} doesn't exist.".format(id))

    if check_author and post['author_id'] != g.user['id']:
        abort(403)

    return post

def preEditData(request):
    data = request.values.get('data', type=str)
    circuitList = json.loads(data)['cols']
    return circuitList

@bp.route('/run', methods=('GET', 'POST'))
def run():
    circuitList=preEditData(request)
    result=circuitTool().run(circuitList)
    return jsonify(result)

@bp.route('/sparkrun', methods=('GET', 'POST'))
def sparkrun():
    circuitList=preEditData(request)
    result= sparkTool().sparkRun(circuitList)
    return jsonify(result)

