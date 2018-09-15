// 数据类型的中文名称键值对
var categoryMatch = {
    'stock': '股票',
    'account': '账户',
    'department': '营业部',
    'member': '会员',
    'survey': '调查单'
};
// 数据详情的中文名称键值对
var keywordsMatch = {
    'info_id': '调查单',
    'remark': '备注',
    'time': '时间',
    'type': '类型',
    'exceptionname': '异常行为名称',
    'actname': '调查事项',
    'code': '代码',
    'name': '名称',
    'count': '数量'
};
// 初始化Echarts
var myChart = echarts.init(document.getElementById('main'));
// 定义Echarts的配置项
var option = {
    "animationEasingUpdate": "quinticInOut", // 数据更新动画的缓动效果
    "animationDurationUpdate": 1500, // 数据更新动画的时长
    "animation": "auto", // 是否开启动画
    "animationDuration": 500, // 初始动画的时长
    "animationEasing": "exponentialOut", // 初始动画的缓动效果
    "animationThreshold": 1000, // 动画的阈值，当图形数量大于这个阈值时会关闭动画
    "color": [ // 类型颜色列表，依次渲染
        "#FF4A36",
        "#1E53C3",
        "#19B248",
        "#F2C311",
        "#822EB9"
    ],
    "textStyle": { // 文字样式
        "fontFamily": "sans-serif",
        "fontSize": 12,
        "fontStyle": "normal",
        "fontWeight": "normal"
    },
    "progressiveThreshold": 1000, // 启用渐进式渲染的图形数量阈值，在单个系列的图形数量超过该阈值时启用渐进式渲染。
    "progressive": 400, // 渐进式渲染时每一帧绘制图形数量
    "hoverLayerThreshold": 1000, // 图形数量阈值，决定是否开启单独的 hover 层
    "useUTC": false, // 是否使用 UTC 时间
    "series": [{ // 系列列表。每个系列通过 type 决定自己的图表类型
        "label": { // 设置标签属性
            "normal": { 
                "position": "bottom", // 标签位置
                "textStyle": { // 文字样式
                    "fontSize": 12
                },
                "show": true // 是否显示
            }
        },
        "type": "graph", // 图表类型
        "lineStyle": { // 设置连线属性
            "normal": {
                "opacity": 1, // 透明度
                "width": 2, // 粗细
                "curveness": 0, // 曲度
                "type": "dotted" // 线的类型
            }
        },
        "categories": [{ // 节点分类的类目
            "name": "股票"
        }, {
            "name": "调查单"
        }, {
            "name": "账户"
        }, {
            "name": "营业部"
        }, {
            "name": "会员"
        }],
        "layout": "force", // 图的布局：力引导布局
        "force": { // 力引导布局配置
            "repulsion": 400, // 节点之间的斥力因子
            "edgeLength": [50, 100] // 边的两个节点之间的距离
        },
        // "roam": true, // 是否开启鼠标缩放和平移漫游
        // "focusNodeAdjacency": true // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点
    }],
    "legend": [{ // 图例配置
        "x": "50px", // 离左边的距离
        "y": "30px", // 离顶部的距离
        "textStyle": { // 文字样式
            "color": '#6F7D9A',
            "fontSize": 14
        },
        "data": ["股票", "调查单", "账户", "营业部", "会员"] // 图例文字内容列表
    }],
    "tooltip": { // 提示框配置
        "enterable": true, // 鼠标是否可进入提示框浮层中
        "hideDelay": 100, // 浮层隐藏的延迟
        "backgroundColor": '#1E3054', // 背景颜色
        "borderRadius": 10, // 圆角
        "padding": 0, // 内边距
        "extraCssText": 'width:280px;height:auto;', // 额外附加到浮层的 css 样式
        "formatter": function(param) { // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
            var data = param.data.data; // 读取当前节点内容
            if (data && data.type) { // 判断内容是否存在
                var type = data.type; // 读取当前节点类型
            }
            var _html = ""; // 初始化字符串模版
            if (type == "account") { // 如果是账户类型，则显示以下字段
                _html = '<div class="popup">' +
                    '<p class="name">' + formatStr(data.name) + '</p>' +
                    '<div class="body">' +
                    '<div class="item">' +
                    '<p class="title">账户代码：</p>' +
                    '<p class="desc">' + formatStr(data.code) + '</p>' +
                    '</div>' +
                    '<div class="item">' +
                    '<p class="title">所属会员：</p>' +
                    '<p class="desc">' + formatStr(data.name) + '</p>' +
                    '</div>' +
                    '<div class="item">' +
                    '<p class="title">所属营业部：</p>' +
                    '<p class="desc">' + formatStr(data.department) + '</p>' +
                    '</div>' +
                    '</div></div>';
            } else if (type == "survey") { // 如果是调查单类型，则显示以下字段
                _html = '<div class="popup">' +
                    '<p class="name">' + formatStr(data.exceptionname) + '</p>' +
                    '<div class="body">' +
                    '<div class="item">' +
                    '<p class="title">调查事项：</p>' +
                    '<p class="desc">' + formatStr(data.actname) + '</p>' +
                    '</div>' +
                    '<div class="item">' +
                    '<p class="title">异常行为：</p>' +
                    '<p class="desc">' + formatStr(data.exceptionname) + '</p>' +
                    '</div>';
                if (data.remark && data.remark != "") { // 如果有事项描述，则渲染相关dom
                    _html += '<div class="item">' +
                        '<p class="title">事项描述：</p>' +
                        '<p class="desc">' + formatStr(data.remark) + '</p>' +
                        '</div>'
                }
                _html += '</div></div>';
            }
            if (_html != '' && param.dataType != 'edge') { // 如果模版存在切鼠标悬浮位置不为连接线，则渲染提示框
                return _html;
            }
        }
    }
}; 

// 将上面的配置项导入Echarts
myChart.setOption(option); 

// 通过ajax获取数据, query为查询语句，mainType为当前搜索的类型（下拉框选择）
var getData = function(query, mainType) {
    $.ajax({
        "headers": {
            "Accept": "application/json; charset=utf-8",
            "Authorization": "Basic bmVvNGo6Y2xvdWRicmFpbg==" // 数据库密码
        },
        "type": "post",
        "url": 'http://139.219.231.49:7474/db/data/cypher',
        "data": {
            "query": query
        },
        success: function(res) {
            if (res.data == '') { // 如搜索结果为空
                showToast('无结果'); // 提示用户无结果
                return false;
            }
            formatData(res.data, mainType); // 如有搜索结果，调用该方法
        }
    });
};

// 因为Echats的提示框不支持断行，通过此方法判断到了一定字符数断行，str为需要转换的段落
var formatStr = function(str) {
    var arr = str.split(''); // 将字符串的每一个字转换成一个数组值
    for (var i = 16; i < arr.length; i += 17) { // 根据当前的提示框宽度，选择每一行的最大字符数
        arr[i] += '</br>'; // 加上换行符
    }
    str = arr.join("") // 将带换行符的新数组重新组合为字符串
    return str; // 返回新字符串
};

// 将请求的数据结果转换为Echarts可使用的数据结构
var formatData = function(res, mainType) {
    var _data = [];
    var _links = [];
    var _namesList = [];
    if (res && res != '') { // 如果搜索结果存在
        for (var i in res) { // 循环搜索结果数组
            var row = res[i];
            var size = 64; // 初始化节点大小
            for (var j = 0; j < row.length; j++) {
                var data = row[j].data;
                if (_namesList.indexOf(data.name) == -1) { // 判断该节点是否已存在，如果不存在，则执行括号内逻辑
                    _namesList.push(data.name); // 将节点名称添加到已存在数组
                    size = (data.type == mainType ? 140 : 64); // 如果该节点为搜索关键字类型，则大小为140，否则为6节点类型4
                    _data.push({ // 将节点数据存入数组
                        "category": categoryMatch[data.type], // 
                        "draggable": true, // 是否可拖拽
                        "name": data.name ||  data.exceptionname, // 节点名称，有name则存name，否则存exceptionname
                        "symbolSize": size, // 节点大小
                        "symbol": 'image://../images/' + data.type + '.png', // 节点图表
                        "data": data // 节点数据（提示框和详情使用）
                    });
                }
                if (j < row.length - 1) { // 添加节点之间的线条
                    _links.push({
                        "source": data.name || data.exceptionname, // 来源名称，有name则存name，否则存exceptionname
                        "target": row[j + 1].data.name || row[j + 1].data.exceptionname // 目标名称，有name则存name，否则存exceptionname
                    });
                }
            }
        }
    }
    myChart.setOption({ // 将拉取到的新数据更新到Echarts
        series: {
            "data": _data, // 节点
            "links": _links // 线条
        }
    });
};

// 格式化日期，date为传入的日期，hasHyphen为是否需要"-"
var dateFormat = function(date, hasHyphen) {
    var date = new Date(date); // 代码化传入的日期
    var month = '0' + (date.getMonth() + 1); // 获取当前月份
    var day = '0' + date.getDate(); // 获取当前日
    if (hasHyphen) { // 判断是否有“-”来返回不同格式的日期
        var dateFormat = date.getFullYear() + '-' + month.substring(month.length - 2) + '-' + day.substring(day.length - 2);
    } else {
        var dateFormat = date.getFullYear() + '' + month.substring(month.length - 2) + '' + day.substring(day.length - 2);
    }
    return dateFormat; // 返回格式化的日期
};

// 显示弹出框，msg为弹出框内容
var showToast = function(msg) {
    var $toast = $('#toast'); // 获取弹出框dom
    $toast.text(msg).fadeIn('slow'); // 将自定义内容填入弹出框，并显示弹出框
    var to = setTimeout(function() { // 1500毫秒后隐藏弹出框
        $toast.fadeOut('slow');
        clearTimeout(to);
    }, 1500);
};

// 文档加载完毕后执行
$(function() {
    var currentDate = new Date(); // 获取当前的时间
    var lastWeek = new Date(currentDate.getTime() - 7 * 24 * 3600 * 1000); // 获取当前时间前一周的时间
    $("#startDate").val(dateFormat(lastWeek, true)); // 获取当前时间的格式化日期
    $("#endDate").val(dateFormat(currentDate, true)); // 获取上一周的格式化日期
    $("#startDate").datepicker({ // datepicker为第三方插件，为开始日期初始化插件
        changeMonth: true, // 可选择月份
        changeYear: true, // 可选择年份
        dateFormat: 'yy-mm-dd' // 选择后的日期格式
    });
    $("#endDate").datepicker({ // datepicker为第三方插件，为结束日期初始化插件
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm-dd'
    });
    $('.selected').on('click', function(e) { // 点击下拉框
        e.stopPropagation(); // 阻止冒泡
        $(this).siblings('.select').toggleClass('open'); // 弹出下拉框选项
    });
    $('.select li').on('click', function(e) { // 点击下拉框选项
        e.stopPropagation();
        $(this).parent().removeClass('open').siblings('.selected').text($(this).text()); // 隐藏下拉框选项并显示选择结果
    });
    $('body').on('click', function() { // 点击除下拉框意外的其他部分
        $('.select').removeClass('open'); // 隐藏下拉框
    });
    $('.confirm').on('click', function() { // 点击搜索按钮
        var input = $('.search-input').val().trim(); // 获取搜索框内容并清除空格
        if (input == '') { // 如果内容为空
            showToast('请输入关键字');
            return false; // 不进行下面的逻辑
        }
        var startDateFormat = dateFormat(new Date($('#startDate').val()), false);
        var endDateFormat = dateFormat(new Date($('#endDate').val()), false);
        var type = $('.selected').text(); // 获取搜索的类型
        var query = '',
            mainType = '';
        switch (type) { // 根据搜索的类型判断数据库查询语句和mainType
            case '账户名称':
                query = "match (st:stock)<-[:SURVEY]-(survey)-[:SURVEY]->(ac:account)-[:BELONG_TO]->(dt)-[:BELONG_TO]->(mr) where survey.time >= " + startDateFormat + " and survey.time <= " + endDateFormat + " and ac.name=~'.*" + input + ".*' return st, survey, ac, dt, mr limit 1"
                mainType = "account";
                break;
            case '账户编码':
                query = "match (st:stock)<-[:SURVEY]-(survey)-[:SURVEY]->(ac:account)-[:BELONG_TO]->(dt)-[:BELONG_TO]->(mr) where survey.time >= " + startDateFormat + " and survey.time <= " + endDateFormat + " and ac.code=~'.*" + input + ".*' return st, survey, ac, dt, mr limit 1"
                mainType = "account";
                break;
            case '证券名称':
                query = "match (survey)-[:SURVEY]->(st:stock), (survey)-[:SURVEY]->(ac:account)-[:BELONG_TO]->(dt)-[:BELONG_TO]->(mr) where survey.time >= " + startDateFormat + " and survey.time <= " + endDateFormat + " and st.name=~'.*" + input + ".*' return st, survey, ac, dt, mr limit 1"
                mainType = "stock";
                break;
            case '证券编码':
                query = "match (survey)-[:SURVEY]->(st:stock), (survey)-[:SURVEY]->(ac:account)-[:BELONG_TO]->(dt)-[:BELONG_TO]->(mr) where survey.time >= " + startDateFormat + " and survey.time <= " + endDateFormat + " and st.code=~'.*" + input + ".*' return st, survey, ac, dt, mr limit 1"
                mainType = "stock";
                break;
            case '调查单编号':
                query = "match (st:stock)<-[:SURVEY]-(survey:survey)-[:SURVEY]->(ac:account)-[:BELONG_TO]->(dt)-[:BELONG_TO]->(mr) where survey.time >= " + startDateFormat + " and survey.time <= " + endDateFormat + " and survey.info_id=~'.*" + input + ".*' return st, survey, ac, dt, mr limit 1"
                mainType = "survey";
                break;
            case '会员名称':
                query = "match (st:stock)<-[:SURVEY]-(survey:survey)-[:SURVEY]->(ac:account)-[:BELONG_TO]->(dt:department)-[:BELONG_TO]->(mr:member) where survey.time >= " + startDateFormat + " and survey.time <= " + endDateFormat + " and mr.name=~'.*" + input + ".*' return st, survey, ac, dt, mr limit 1"
                mainType = "member";
                break;
            case '会员营业部':
                query = "match (st:stock)<-[:SURVEY]-(survey:survey)-[:SURVEY]->(ac:account)-[:BELONG_TO]->(dt:department)-[:BELONG_TO]->(mr:member) where survey.time >= " + startDateFormat + " and survey.time <= " + endDateFormat + " and dt.name=~'.*" + input + ".*' return st, survey, ac, dt, mr limit 1"
                mainType = "department";
                break;
        }
        getData(query, mainType); // 根据查询语句和搜索类型请求数据
    });
});

// 点击节点渲染详情
myChart.on('click', function(param) { 
    var dataIndex = param.dataIndex; // 获取节点序列号（序号自动按序生成）
    if (param.data.data) { // 如果有数据
        var data = param.data.data; // 获取节点数据
        // 初始化详情模版
        var html = '<div class="item" data-index="' + dataIndex + '">';
        html += '<div class="functions"><img class="checkbox" src="../images/checkbox.png" /><img class="delete" src="../images/off.png" /></div>';
        for (var k in data) { // 添加数据数组的键值对
            html += '<p><span>' + keywordsMatch[k] + '：</span><span>' + (k == "type" ? categoryMatch[data[k]] : data[k]) + '</span></p>';
        }
        html += '</div>';
        $('.details-container .content').append(html); // 在详情框添加数据
    }
});

// 点击详情框的删除按钮
$('.details-container').delegate('.delete', 'click', function() {
    $(this).parents('.item').remove(); // 移除当前数据
});

// 点击详情数据的选择框改变是否勾选的样式
$('.details-container').delegate('.checkbox', 'click', function() {
    if ($(this).attr('src') == '../images/checked.png') {
        $(this).attr('src', '../images/checkbox.png');
    } else {
        $(this).attr('src', '../images/checked.png');
    }
});

// 点击详情页的清空按钮，清空所有详情
$('#clear').on('click', function() {
    $('.details-container .content').empty();
});

// 点击删除所有按钮，清空所有已勾选的详情数据
$('#deleteAll').on('click', function() {
    var checkbox = $('.details-container').find('.checkbox'); // 找到详情container
    for (var i = 0; i < checkbox.length; i++) { // 判断是否已勾选，如已勾选，则移除相关数据
        if ($(checkbox[i]).attr('src') == '../images/checked.png') {
            $(checkbox[i]).parents('.item').remove();
        }
    }
});

// 鼠标移进详情框，在对应的节点上高亮
$('.details-container').delegate('.item', 'mouseover', function() {
    var index = $(this).data('index'); // 获取该详情的序列号，渲染详情时绑定
    var to = setTimeout(function() { //  setTimeout将该动作置于栈的最后，以确保节点已存在
        myChart.dispatchAction({
            type: 'focusNodeAdjacency',
            seriesIndex: 0, // 图表序列号，鉴于只有一个表，固定为0
            dataIndex: index // 为该序列号的节点添加高亮
        });
        clearTimeout(to);
    }, 0);
});

// 鼠标移进详情框，在对应的节点上移除高亮，逻辑同上
$('.details-container').delegate('.item', 'mouseout', function() {
    var index = $(this).data('index');
    var to = setTimeout(function() {
        myChart.dispatchAction({
            type: 'unfocusNodeAdjacency',
            seriesIndex: 0,
            dataIndex: index
        });
        clearTimeout(to);
    }, 0);
});