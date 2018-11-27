var g_guid;
var filename;
var fileId;
function getGuid() {
    var guid = WebUploader.Base.guid();
    g_guid = guid;
    return guid;
}

$.initUploader = function (uploadType, getList, fileExt) {
    var uploader = WebUploader.create({
        auto: true,
        // swf文件路径
        swf: '/scripts/webuploader/Uploader.swf',
        // 文件接收服务端。
        server: '/Template/UpdateFile',
        // 选择文件的按钮。可选。
        pick: '#picker',
        chunked: true,
        threads: 1,
        chunkSize: 209715200,
        fileSingleSizeLimit: 1048576 * 1024 * 50,
        ////上传域的名称
        fileVal: 'Filedata',
        formData:
        {
            guid: getGuid(),
            uploadType: uploadType
        }
    });
    if ($('#responsive')) {
        $('#responsive').on('shown.bs.modal', function () {
            uploader.addButton({
                id: '#picker',
                innerHTML: '上传文件'
            });
        });
    }

    //当validate不通过时，会以派送错误事件的形式通知
    uploader.on('error', function (type) {
        switch (type) {
            case 'Q_EXCEED_NUM_LIMIT':
                artAlert("错误：上传文件数量过多！");
                break;
            case 'Q_EXCEED_SIZE_LIMIT':
                artAlert("错误：文件总大小超出限制！");
                break;
            case 'F_EXCEED_SIZE':
                artAlert("错误：文件大小超出限制！");
                break;
            case 'Q_TYPE_DENIED':
                artAlert("错误：禁止上传该类型文件！");
                break;
            case 'F_DUPLICATE':
                artAlert("错误：请勿重复上传该文件！");
                break;
            default:
                artAlert('错误代码：' + type);
                break;
        }
    });

    // 当有文件被添加进队列的时候
    uploader.on('fileQueued', function(file) {
        fileId = file.id;
        //console.log(file);
        var content = '<div id="' + file.id + '" class="item">' +
            '<p class="state"></p>' +
            '</div>'; //'<h4 class="info">' + file.name + '</h4>' +
        if ($.inArray(file.ext, fileExt) === -1) {
            artAlert("不允许上传" + file.ext + "类型的文件！");
            uploader.removeFile(file, true);
            return;
        }

        var name = uploadType === "sysFile" ? "FileExist" : "ClientFileExist";
        console.log(name);
        $.ajax({
            type: "post",
            dataType: "json",
            async: false,
            url: "/Template/" + name,
            data: { name: file.name },
            success: function (data) {
                console.log(data.status);
                if (data.status === 0) {
                    artAlert(data.msg);
                    uploader.removeFile(file, true);
                } else {
                    $("#thelist").append(content);
                    filename = file.name;
                }
            }
        });
    });
    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if (!$percent.length) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
        }

        //$li.find('p.state').text('上传中');

        $percent.css('width', percentage * 100 + '%').text((percentage * 100).toFixed(2) + "%");
    });

    uploader.on('uploadSuccess', function (file, data) {
        var $state = $('#' + file.id).find('p.state');
        if (data.status === 1) {
            //$state.text("已上传");
            if (getList) getList();
            //模板上传
            var $osPath = $("#OSPath");
            if ($osPath) {
                $osPath.val(data.absolutePath);
                $('#form').submit();
            }
        } else {
            $state.text(data.msg);
        }
    });

    uploader.on('uploadError', function (file) {
        $('#' + file.id).find('p.state').text('上传出错');
    });

    uploader.on('uploadComplete', function (file) {
        $('#' + file.id).find('.progress').fadeOut();
    });

    return uploader;
}