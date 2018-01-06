# coding=utf-8

# 网络请求
import requests
# 日志输出
import logging
import json
# 串口通信
import serial
# 多线程
import threading
import time
from urllib import parse,request

#日志输出配置
logging.basicConfig(level=logging.WARNING,
	format='%(asctime)s ---- %(name)s %(message)s')
log=logging.getLogger("update")
log.setLevel(logging.DEBUG)
#用户api认证key
# U-ApiKey='6bfa994b1142e43607015aabb6829fdf'
header_dict = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko'}
url = 'http://gdbxgy.xyz/api.php?arduino=yes&wet=20&temp=30'
textmod = {'arduino': 'yes', 'temp': '80'}
#简单串口读取
#具体参数根据实际更改
#端口 波特率 奇偶校验 停止位 word的位
ser = serial.Serial(
		port='com4',
		baudrate=9600,
		parity=serial.PARITY_ODD,
		stopbits=serial.STOPBITS_TWO,
		bytesize=serial.SEVENBITS
	)
headers={'U-ApiKey':'6bfa994b1142e43607015aabb6829fdf','content-type':'application/json'}
def update(temperture):
	#上传温度
	data={}
	data['value']=temperture
	#temperture=60.0
	url="http://gdbxgy.xyz/api.php?arduino=yes&wet=20&temp=%s"%(temperture)
	print(url)
	response=requests.post(url=url,headers=headers,data=json.dumps(data))
	if response.status_code==200:
		log.info("温度为%s   上传成功"%(temperture))
	elif(response.status_code==406):
		log.warning("%s   上传失败\n原因：上传频率过快"%(temperture))
	else:
		log.warning("%s   上传失败"%(temperture))



def getData():
	data = ''

	while True:
		mThread = threading.Thread(target=getSwitchState)
		mThread.setDaemon(True)
		mThread.start()
		data = ser.readline()
		data=data[:len(data)-1]
		threading.Thread(target=update,args=(data.decode('ascii'),)).start()

def getSwitchState():
	#获取开关状态,默认1
	state_End=1
	state_Last=1
	while True:
			try:
				textmod = {'arduino': 'yes', 'temp': '80'}
				textmod = parse.urlencode(textmod)
				header_dict = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko'}
				url = 'http://gdbxgy.xyz/cmd_api.html'
				req = request.Request(url='%s' % (url), headers=header_dict)
				res = request.urlopen(req)
				res = res.read()
				res=(res.decode(encoding='utf-8'))
				#res="{led_1_0}"
				print(res)
				if res=="{led_1_1}":
					ser.write("1".encode("ascii"))
				else:
					ser.write("2".encode("ascii"))
				#jsonValue=requests.get("http://api.yeelink.net/v1.0/device/353577/sensor/398923/datapoints",timeout=2).text
				#data=json.loads(jsonValue)
			except:
				print("获取开关状态发生异常")
				continue

			state_End=state_Last
			#state_Last=data['value']
			time.sleep(1)
			#为0时写2进入stm32
			if state_Last!=state_End:
				if state_Last==1:
					ser.write("1".encode("ascii"))
				else:
					ser.write("2".encode("ascii"))
				log.warning("开关状态改变,状态为:%d"%(state_Last))

def getDataPoint(start,end):
	url=''
	pass

def getDataPoints(point):
	url=''
	pass




if __name__=='__main__':
	getData()