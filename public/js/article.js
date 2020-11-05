ClassicEditor
    .create(document.querySelector('#content'), {
        language: 'zh-cn',
        // 指定图片上传的地址
        ckfinder: {
            uploadUrl: '/articles/uploadImage',
        },
    })
    .catch(error => {
        console.log(error);
    });