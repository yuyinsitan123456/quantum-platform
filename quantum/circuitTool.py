import sys
sys.path.insert(0, 'C://Users//cxzx//PycharmProjects//quantum-platform//quantum')
import math
import cirq
import quantum.config as CONFIG

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
            resultDict = {'x': name, 'y': frequencies[name[2:].zfill(qubitNumber)] / CONFIG.REPETITIONS}
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
        circuiMap = zip(circuitStr, circuitFuc)
        circuitDict = dict((name, value) for name, value in circuiMap)
        return circuitDict

    def basic_circuit(self,cd, qs):
        circuitDict=self.getCircuitDict()
        for col in cd:
            count = 0
            pairswap = 0
            paircnot = 0
            swap = qs[0]
            cont = qs[0]
            monent = list()
            for gate in col:
                if gate == 'Swap':
                    if pairswap == 0:
                        pairswap += 1
                        swap = qs[count]
                    else:
                        monent.append(cirq.SWAP(swap, qs[count]))
                elif gate == '•':
                    if paircnot == 0:
                        paircnot += 1
                        cont = qs[count]
                    else:
                        monent.append(cirq.CNOT(cont, qs[count]))
                elif gate != 1:
                    monent.append(circuitDict[gate](qs[count]))
                count += 1
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





