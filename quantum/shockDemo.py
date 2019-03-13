import urllib

test_data = 'sh601006'
# test_data_urlencode = urllib.parse.urlencode(test_data).encode('utf-8')

requrl = "http://hq.sinajs.cn/list="+test_data

req = urllib.request.Request(url = requrl)
print (req)

res_data = urllib.request.urlopen(req)
res = res_data.read()
print (res)