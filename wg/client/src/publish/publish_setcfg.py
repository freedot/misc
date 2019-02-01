import os


#image_base_url = 'http://203.195.190.81/images/'
#image_base_url = 'http://1251007151.cdn.myqcloud.com/1251007151/images/'
image_base_url = '../images/'
src_base_path = 'E:/MyWork/wg/trunk/web/'
publish_path = 'E:/MyWork/wg/trunk/publish/'
output_path = os.path.join(publish_path, 'output/')
to_base_path = os.path.join(output_path, 'final/')
lastfilesver_path = os.path.join(output_path, 'lastfilesver.txt')

#url1 = '203.195.190.81'
#url = '=CADKBJFKBJAKIB'
append_zone_config_bak = r'''
# -- append by publish tool --
#url = 's16.app1101114844.qqopenapp.com'
url = 's20.app1101114844.qqopenapp.com'
proxy = {'type':'TGW', 'url':url + ':' + str(port) }
image_base_url = '%s'
is_debug = False
'''

append_zone_config = r'''
zoneid = 1
payZoneId = 1
url = '119.29.105.239'
port = 8001
#image_base_url = '%s'
image_base_url = 'images/'
is_debug = True
proxy = {'type':'NONE', 'url':'' }
'''
