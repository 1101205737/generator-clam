## <%= packageName %> 项目文档

- 创建者: <%= author %>
- 创建者Email: <%= email %>
- 项目地址: http://gitlab.alibaba-inc.com/<%= groupName %>/<%= packageName %>

Demo 启动

	grunt demo

离线包构建参数修改：修改`abc.json`里的basePath和baseUrl，确保构建的`cache_info.json`正确。在项目根目录执行make.sh，make.sh里的内容，参照注释修改

离线包的在线调试：

	grunt offline

在线包调试：

	grunt online

命令帮助:`yo clam:h`

### changeLog
