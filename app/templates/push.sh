#! /bin/sh

# 构建H5离线包脚本
# grunt build 完成后 在当前目录下执行./make.sh
# 生成ios的zip包，放在根目录下
# 同时adb推build_offline文件到android机器里

cd build_offline
adb push ./ /data/data/com.taobao.trip/files/h5app/<%= packageName %>/
