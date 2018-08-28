var categoryMatch = {
    'stock': '股票',
    'account': '账户',
    'department': '营业部',
    'member': '会员',
    'survey': '调查单'
};
var myChart = echarts.init(document.getElementById('main'));
var option = {
    "animationEasingUpdate": "quinticInOut",
    "animationDurationUpdate": 1500,
    "color": [
        "#FF4A36",
        "#1E53C3",
        "#19B248",
        "#F2C311",
        "#822EB9"
    ],
    "textStyle": {
        "fontFamily": "sans-serif",
        "fontSize": 12,
        "fontStyle": "normal",
        "fontWeight": "normal"
    },
    "animation": "auto",
    "animationDuration": 500,
    "animationEasing": "exponentialOut",
    "animationThreshold": 1000,
    "progressiveThreshold": 1000,
    "progressive": 400,
    "hoverLayerThreshold": 1000,
    "useUTC": false,
    "series": [{
        "label": {
            "normal": {
                "position": "bottom",
                "textStyle": {
                    "fontSize": 12
                },
                "show": true
            }
        },
        "type": "graph",
        "lineStyle": {
            "normal": {
                "opacity": 1,
                "width": 2,
                "curveness": 0,
                "type": "dotted"
            }
        },
        "categories": [{
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
        "layout": "force",
        "symbolSize": 2,
        "force": {
            "repulsion": 600,
            "edgeLength": [100, 300]
        },
        "roam": true,
        "focusNodeAdjacency": true
    }],
    "legend": [{
        "x": "50px",
        "y": "30px",
        "textStyle": {
            "color": '#6F7D9A',
            "fontSize": 14
        },
        "data": ["股票", "调查单", "账户", "营业部", "会员"]
    }],
    "tooltip": {
        "enterable": true,
        "hideDelay": 100,
        "backgroundColor": '#1E3054',
        "borderRadius": 10,
        "padding": 0,
        "extraCssText": 'width:280px;height:auto;',
        "formatter": function(param) {
            var data = param.data.data;
            if (data && data.type) {
                var type = data.type;
            }
            var _html = "";
            if (type == "account") {
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
                    '<p class="desc"></p>' +
                    '</div>' +
                    '</div></div>';
            } else if (type == "survey") {
                _html = '<div class="popup">' +
                    '<p class="name">' + formatStr(data.actname) + '</p>' +
                    '<div class="body">' +
                    '<div class="item">' +
                    '<p class="title">调查事项：</p>' +
                    '<p class="desc">' + formatStr(data.actname) + '</p>' +
                    '</div>' +
                    '<div class="item">' +
                    '<p class="title">异常行为：</p>' +
                    '<p class="desc">' + formatStr(data.exceptionname) + '</p>' +
                    '</div>' +
                    '<div class="item">' +
                    '<p class="title">事项描述：</p>' +
                    '<p class="desc">' + formatStr(data.remark) + '</p>' +
                    '</div>' +
                    '</div></div>';
            }
            if (_html != '' && param.dataType != 'edge') {
                return _html;
            }
        }
    },
    "animationEasingUpdate": "quinticInOut",
    "animationDurationUpdate": 1000
};
myChart.setOption(option);
$.ajax({
    "headers": {
        "Accept": "application/json; charset=utf-8",
        "Authorization": "Basic bmVvNGo6Y2xvdWRicmFpbg=="
    },
    "type": "post",
    "url": 'http://139.219.231.49:7474/db/data/cypher',
    "data": {
        "query": "MATCH (n)-[r]->(m) return labels(n), n, type(r), m, labels(m)"
    },
    success: function(res) {
        formatData(res.data);
    }
});
var formatStr = function(str) {
    var arr = str.split('');
    for (var i = 16; i < arr.length; i += 17) {
        arr[i] += '</br>';
    }
    str=arr.join("")
    return str;
};
var formatData = function(data) {
    var res = data;
    var _data = [];
    var _links = [];
    var main = res[0][1].data;
    _data.push({
        "category": categoryMatch[main.type],
        "draggable": true,
        "name": main.actname,
        "symbolSize": 140,
        "symbol": 'image://../images/' + main.type + '.png',
        "data": main
    });
    for (var i in res) {
        var row = res[i];
        console.log(row);
        if (row[2] == "BELONG_TO") {
            _data.push({
                "category": categoryMatch[row[3].data.type],
                "draggable": true,
                "name": row[3].data.name,
                "symbolSize": 64,
                "symbol": 'image://../images/' + row[3].data.type + '.png',
                "data": row[3].data
            });
            _links.push({
                "source": row[1].data.name,
                "target": row[3].data.name
            });
        } else {
            _data.push({
                "category": categoryMatch[row[3].data.type],
                "draggable": true,
                "name": row[3].data.name,
                "symbolSize": 80,
                "symbol": 'image://../images/' + row[3].data.type + '.png',
                "data": row[3].data
            });
            _links.push({
                "source": main.actname,
                "target": row[3].data.name
            });
        }
    }
    myChart.setOption({
        series: {
            "data": _data,
            "links": _links
        }
    });
}