import sys
sys.path.insert(0, 'C://Users//cxzx//PycharmProjects//quantum-platform')
from pyspark import SparkConf, SparkContext
import quantum.quantumCircuitSlit as splitTool
import quantum.circuitTool as circuitTool
# build circuit according to the web request
class sparkTool:
    def sparkRun(self,circuitList):
        conf = SparkConf() \
            .setMaster("spark://192.168.2.200:7077") \
            .setAppName("quantum") \
            .set("spark.cores.max", "20")
        sc = SparkContext(conf=conf)
        rdd =sc.parallelize(splitTool().splitPathTwo(circuitList,circuitTool().get_qubit_number(circuitList)),2)
        result=rdd.mapPartitions(self.sendWork).collect()
        sc.stop()
        return result

    def sendWork(self,circuitList):
        return circuitTool().run(circuitList)




