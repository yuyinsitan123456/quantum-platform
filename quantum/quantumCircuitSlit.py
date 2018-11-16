import sys
sys.path.insert(0, 'C://Users//cxzx//PycharmProjects//quantum-platform//quantum')
import math

class splitTool:
    # 优化链路结构，将单逻辑门和双逻辑门分开
    def optimizePath(self,circuit):
        circuits=[]
        #暂时将原逻辑门返回
        circuits.append(circuit)
        return circuits

    # 拆分逻辑链路为上下两部分
    def splitPathTwo(self,circuit,qubitNumber):
        pcircuits=self.optimizePath(circuit)
        #按照quibit数量，分为上下两层
        upNum=int(qubitNumber/2)
        downNum=qubitNumber-upNum
        # 遍历逻辑门，每次前进一层，按层拆分
        currentPosition = 0
        partiton=0
        partitonDep=[]
        currentDep=0
        for col in pcircuits[0]:
            upSGate=0
            downSGate = 0
            if len(col)>upNum:
                currentPosition=0
                for gate in col:
                    if gate == 'Swap':
                        if upNum>currentPosition:
                            upSGate+=1
                        else:
                            downSGate+=1
                    currentPosition+=1
                if upSGate==downSGate and upSGate>0:
                    partiton+=1
                    partitonDep.append(currentDep)
            currentDep+=1

        partitionCircuits=[]
        gateTools=[1,-1]
        partNum=pow(2,partiton)
        for num in range(0,partNum):
            s = bin(num)[2:].zfill(partiton)
            print(s)
            currentDep=0
            currentSDep = 0
            partitionCircuitUs = []
            partitionCircuitDs = []
            for col in pcircuits[0]:
                partitionCircuitU = []
                partitionCircuitD = []
                if len(col) < upNum + 1:
                    for i in range(0, len(col)):
                        partitionCircuitU.append(col[i])
                        print(partitionCircuitU)
                    partitionCircuitD.append([])
                else:
                    if currentDep in partitonDep:
                        for i in range(0,upNum):
                            if col[i]=='Swap':
                                partitionCircuitU.append(gateTools[int(s[currentSDep])])
                            else:
                                partitionCircuitU.append(col[i])
                        for i in range(upNum,len(col)):
                            if col[i] == 'Swap':
                                if s[currentSDep]=='0':
                                    if i<len(col):
                                        partitionCircuitD.append(1)
                                else:
                                    partitionCircuitD.append('Z')
                            else:
                                partitionCircuitD.append(col[i])
                        currentSDep+=1
                    else:
                        for i in range(0,upNum):
                            partitionCircuitU.append(col[i])
                        for i in range(upNum,len(col)):
                            partitionCircuitD.append(col[i])
                partitionCircuitUs.append(partitionCircuitU)
                partitionCircuitDs.append(partitionCircuitD)
                currentDep += 1
            partitionCircuits.append(partitionCircuitUs)
            partitionCircuits.append(partitionCircuitDs)
        return partitionCircuits




