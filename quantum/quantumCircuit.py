from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for,jsonify
)
from werkzeug.exceptions import abort

from quantum.auth import login_required
from quantum.db import get_db
import json
import cirq

bp = Blueprint('quantumCircuit', __name__)


@bp.route('/')
def index():
    """Show all the posts, most recent first."""
    db = get_db()
    posts = db.execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' ORDER BY created DESC'
    ).fetchall()
    return render_template('quantumCircuit/quirk.html', posts=posts)


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

def resultEncode(final_state):
    names=list()
    for i in range(len(final_state)):
        names.append(str(bin(i)))
    final_state1=map(lambda x:{'real':x.real,'imag':x.imag},final_state)
    resultmap = zip(names, final_state1)
    resultDict = dict((name, value) for name, value in resultmap)
    return resultDict

circuitStr=list()
circuitFuc=list()
circuitStr.append('X')
circuitFuc.append(cirq.X)
circuitStr.append('Y')
circuitFuc.append(cirq.Y)
circuitStr.append('Z')
circuitFuc.append(cirq.Z)
circuitStr.append('H')
circuitFuc.append(cirq.H)
circuiMap = zip(circuitStr, circuitFuc)
circuitDict=dict((name, value) for name, value in circuiMap)

@bp.route('/run', methods=['GET'])
def run():
    data = request.values.get('data', type=str)
    circuitList=json.loads(data)['cols']

    def get_qubit_number(cd):
        l=0
        for c in cd:
            if l<len(c):
                l=len(c)
        return l

    qubitNumber = get_qubit_number(circuitList)
    qubits = [cirq.GridQubit(x, 0) for x in range(qubitNumber)]

    # build circuit according to the web request
    def basic_circuit(cd,qs):
        for col in cd:
            count=0
            pair=0
            swap=qs[0]
            monent=list()
            for gate in col:
                if gate==1:
                    count += 1
                elif gate=='Swap':
                    if pair==0:
                        pair+=1
                        swap=qs[count]
                    else:
                        monent.append(cirq.SWAP(swap,qs[count]))
                else:
                    monent.append(circuitDict[gate](qs[count]))
            yield monent
        yield [cirq.measure(qs[x], key='q'+str(x)) for x in range(len(qs))]

    circuit=cirq.Circuit()
    circuit.append(basic_circuit(circuitList,qubits))
    simulator=cirq.google.XmonSimulator()
    result = simulator.simulate(circuit,qubit_order=qubits)
    return jsonify(result=resultEncode(result.final_state.tolist()))



