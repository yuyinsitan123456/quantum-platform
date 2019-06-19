
import math
import cirq
import numpy as np
import quantum.config as CONFIG
from quantum.SingleQubitMatrixGate import SelfSingleQubitMatrixGate
class circuitTool:
    def resultEncode_wave(self,final_state):
        names = list()
        for i in range(len(final_state)):
            # names.append(str(bin(i))[2:].rjust(math.log(len(final_state),2),'0'))
            names.append(bin(i))
        final_state1 = list(map(lambda x: x.real ** 2 + x.imag ** 2, final_state))
        resultNDict = dict(('x', value) for value in names)
        resultPDict = dict(('y', value) for value in final_state1)
        resultList = list()
        for i in range(len(final_state)):
            resultDict = {'x': names[i], 'y': final_state1[i]}
            resultList.append(resultDict)
        resultLists = list()
        resultLists.append(resultList)
        return resultLists

    def bit_to_str(self,bits):
        return ''.join('1' if e else '0' for e in bits)

    def resultEncode_prob(self,result, qubitNumber):
        frequencies = result.histogram(key='result', fold_func=self.bit_to_str)
        state = 2 ** qubitNumber
        names = list()
        for i in range(state):
            # names.append(str(bin(i))[2:].rjust(qnum,'0'))
            names.append(bin(i))
        resultList = list()
        for name in names:
            resultDict = {'x': name[2:].zfill(qubitNumber), 'y': frequencies[name[2:].zfill(qubitNumber)] / CONFIG.REPETITIONS}
            resultList.append(resultDict)
        resultLists = list()
        resultLists.append(resultList)
        return resultLists

    def get_qubit_number(self,cd):
        l = 0
        for c in cd:
            if l < len(c):
                l = len(c)
        return l

    def getCircuitDict(self):
        circuitStr = list()
        circuitFuc = list()
        # •
        circuitStr.append('X')
        circuitFuc.append(cirq.X)
        circuitStr.append('Y')
        circuitFuc.append(cirq.Y)
        circuitStr.append('Z')
        circuitFuc.append(cirq.Z)
        circuitStr.append('H')
        circuitFuc.append(cirq.H)
        circuitStr.append('Z^½')
        circuitFuc.append(cirq.Z**(1/2))
        circuitStr.append('Z^¼')
        circuitFuc.append(cirq.Z ** (1 / 4))
        circuitStr.append('Z^⅛')
        circuitFuc.append(cirq.Z ** (1 / 8))
        circuitStr.append('Z^-½')
        circuitFuc.append(cirq.Z ** (-1 / 2))
        circuitStr.append('Z^-¼')
        circuitFuc.append(cirq.Z ** (-1 / 4))
        circuitStr.append('Z^-⅛')
        circuitFuc.append(cirq.Z ** (-1 / 8))
        circuitStr.append('X^½')
        circuitFuc.append(cirq.X ** (1 / 2))
        circuitStr.append('X^¼')
        circuitFuc.append(cirq.X ** (1 / 4))
        circuitStr.append('X^⅛')
        circuitFuc.append(cirq.X ** (1 / 8))
        circuitStr.append('X^-½')
        circuitFuc.append(cirq.X ** (-1 / 2))
        circuitStr.append('X^-¼')
        circuitFuc.append(cirq.X ** (-1 / 4))
        circuitStr.append('X^-⅛')
        circuitFuc.append(cirq.X ** (-1 / 8))
        circuitStr.append('Y^½')
        circuitFuc.append(cirq.Y ** (1 / 2))
        circuitStr.append('Y^¼')
        circuitFuc.append(cirq.Y ** (1 / 4))
        circuitStr.append('Y^⅛')
        circuitFuc.append(cirq.Y ** (1 / 8))
        circuitStr.append('Y^-½')
        circuitFuc.append(cirq.Y ** (-1 / 2))
        circuitStr.append('Y^-¼')
        circuitFuc.append(cirq.Y ** (-1 / 4))
        circuitStr.append('Y^-⅛')
        circuitFuc.append(cirq.Y ** (-1 / 8))
        circuitStr.append('P0')
        circuitFuc.append(SelfSingleQubitMatrixGate(np.array([[1,0],[0,0]])))
        circuitStr.append('P1')
        circuitFuc.append(SelfSingleQubitMatrixGate(np.array([[0,0],[0,1]])))
        circuiMap = zip(circuitStr, circuitFuc)
        circuitDict = dict((name, value) for name, value in circuiMap)
        return circuitDict

    def basic_circuit(self, cd, qs):
        circuitDict = self.getCircuitDict()
        for col in cd:
            count = 0
            paircnot = 0
            swap = list()
            cont = list()
            gates = list()
            monent = list()
            for gate in col:
                if gate == 'Swap':
                    swap.append(qs[count])
                elif gate == '•':
                    if paircnot == 0:
                        paircnot += 1
                        cont.append(qs[count])
                    elif paircnot == 1:
                        paircnot += 1
                        cont.append(qs[count])
                elif gate != 1 :
                    gates.append((gate,qs[count]))
                count += 1
            if len(swap) > 0:
                monent.append(cirq.SWAP(swap[0], swap[1]))
                if len(gates) > 0:
                    for (gateType,gatePosition) in gates:
                        monent.append(circuitDict[gateType](gatePosition))
            if len(cont) > 0:
                if len(cont)==1:
                    if gates[0][0]=='X':
                        monent.append(cirq.CNOT(cont[0],gates[0][1]))
                    if gates[0][0] == 'Z':
                        monent.append(cirq.CZ(cont[0],gates[0][1]))
                if len(cont) == 2:
                    monent.append(cirq.TOFFOLI(cont[0],cont[1], gates[0][1]))
            if len(cont) == 0 and len(swap) == 0:
                for (gateType, gatePosition) in gates:
                    monent.append(circuitDict[gateType](gatePosition))
            yield monent
        yield cirq.measure(*qs, key='result')

    def run(self,circuitList):
        qubitNumber = self.get_qubit_number(circuitList)
        qubits = [cirq.GridQubit(x, 0) for x in range(qubitNumber)]
        print(circuitList)
        circuit = cirq.Circuit()
        circuit.append(self.basic_circuit(circuitList, qubits))
        simulator = cirq.google.XmonSimulator()
        result = simulator.run(circuit, repetitions=CONFIG.REPETITIONS)
        return self.resultEncode_prob(result,qubitNumber)





