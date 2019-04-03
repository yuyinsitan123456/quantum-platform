import cirq

def sendWork(circuitList):

    circuitStr = list()
    circuitFuc = list()
    circuitStr.append('X')
    circuitFuc.append(cirq.X)
    circuitStr.append('Y')
    circuitFuc.append(cirq.Y)
    circuitStr.append('Z')
    circuitFuc.append(cirq.Z)
    circuitStr.append('H')
    circuitFuc.append(cirq.H)
    circuiMap = zip(circuitStr, circuitFuc)
    circuitDict = dict((name, value) for name, value in circuiMap)

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
                if gate=='Swap':
                    if pair==0:
                        pair+=1
                        swap=qs[count]
                    else:
                        monent.append(cirq.SWAP(swap,qs[count]))
                elif gate!=1:
                    monent.append(circuitDict[gate](qs[count]))
                count += 1
            yield monent
        yield [cirq.measure(qs[x], key='q'+str(x)) for x in range(len(qs))]

    circuit=cirq.Circuit()
    circuit.append(basic_circuit(circuitList,qubits))

    simulator=cirq.google.XmonSimulator()
    result = simulator.simulate(circuit,qubit_order=qubits)
    return result.final_state.tolist()


