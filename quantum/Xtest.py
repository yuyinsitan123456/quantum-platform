from pyspark import SparkConf, SparkContext
import numpy as np
def Xtest():
    # Configure Spark
    conf = SparkConf() \
        .setMaster("spark://192.168.2.221:7077") \
        .setAppName("quantum") \
        .set("spark.cores.max", "20")\

    sc = SparkContext(conf=conf)
    t1 = np.array([0, 1])
    t2 = np.array([1, 0])
    t3 = np.array(np.sqrt([0.5, 0.5]))
    print("输入：",[t1,t2,t3])
    vectors = sc.parallelize([t1,t2,t3])
    # matrix=np.ones((2,2))-np.identity(2)
    matrix=np.sqrt(0.5)*np.matrix([[1,1],[1,-1]])
    print(matrix)
    sc.runJob(vectors, lambda part: [print(x) for x in part])
    mult=sc.runJob(vectors, lambda part: [np.dot(matrix,x) for x in part])
    sc.runJob(vectors, lambda part: [print(x) for x in part])
    sc.stop()
    print("计算结果：",mult)

if __name__ == '__main__':
    Xtest()