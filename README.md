### Overview

This repository provides code building personal independent quantum-platform.<br>

A quantum experiment is defined on a regular computer and translated by electronics into a series of microwave pulses, which travel to the bottom of the dilution refrigerator, that houses the quantum chip. These microwaves can be controlled to change the state on the quantum processor. Relevant measurements specified by the code are taken and then returned as output, along with information on how the qubits and dilution refrigerator were performing at the time of the experiment.



The basic structure is listed below:<br>
├── quantum/<br>
│   ├── __init__.py<br>
│   ├── db.py<br>
│   ├── schema.sql<br>
│   ├── auth.py<br>
│   ├── quantumCircuit.py<br>
│   ├── templates/<br>
│   │   ├── base.html<br>
│   │   ├── auth/<br>
│   │   │   ├── login.html<br>
│   │   │   └── register.html<br>
│   │   └── quantumCircuit/<br>
│   │       ├── menu.html<br>
│   │       ├── button.html<br>
│   │       ├── toolsbox.html<br>
│   │       └── clipboard.html<br>
│   └── static/<br>
│   │   ├── picture.jpg<br>
│   │   └── style.css<br>
├── tests/<br>
|   └── test.py<br>

## evironment

windows10<br>
python3.7 flask1.0 <br>
prerequisite follow the document: <br>
http://flask.pocoo.org/docs/1.0/<br>
