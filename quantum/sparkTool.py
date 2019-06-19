from pyspark import SparkConf, SparkContext
from quantum.quantumCircuitSlit import splitTool
from quantum.circuitTool import circuitTool
# build circuit according to the web request
class sparkTool:
    def __init__(self):
        if(self.sc is None):
            try:
                conf = SparkConf() \
                    .setMaster("spark://192.168.2.221:7077") \
                    .setAppName("quantum") \
                    .set("spark.cores.max", "20")
                self.sc = SparkContext(conf=conf)
                self.sc.addPyFile('C://Users//cxzx//PycharmProjects//quantum-platform//quantum.zip')
            except:
                self.sc.stop()

    def sparkRun(self,circuitList):
        try:
            rdd =self.sc.parallelize(splitTool().splitPathTwo(circuitList,circuitTool().get_qubit_number(circuitList)),2)
            result=rdd.mapPartitions(self.sendWork).collect()
            return result
        except:
            self.sc.stop()

    def sendWork(self,circuitList):
        print(111111111111111111)
        return circuitTool().run(circuitList)
