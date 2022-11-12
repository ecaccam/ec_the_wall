//=require jquery
$("document").ready(function(){
    $("body")
        .on("submit", "#create_post_form", submitCreatePost)
        .on("click", ".delete_post_button", submitDeletePost)
        
        .on("submit", ".create_comment_form", submitCreateComment)
        .on("click", ".delete_comment_button", submitDeleteComment)
});

/*
* DOCU: This will submit the saving of post
* Triggered by: .on("submit", "#create_post_form", submitCreatePost)
*/
function submitCreatePost(){
    let form = $(this);

    if(form.find("#textarea_post_input").val() !== ""){
        $.post(form.attr("action"), form.serialize(), function(data){
            (data.status) ? $("#wall_container").append(data.result.html) : alert(data.error);
        });
    }

    form[0].reset();
    return false;
}

/*
* DOCU: This will submit the deleting of post
* Triggered by: .on("click", ".delete_post_button", submitDeletePost)
*/
function submitDeletePost(){
    let delete_post_button = $(this);
    let form = $("#delete_post_form");

    form.find("#post_id").val(delete_post_button.data("post-id"))

    $.post(form.attr("action"), form.serialize(), function(data){
        (data.status) ? delete_post_button.closest(".post_container").remove() : alert(data.error);
    });

    return false;
}

/*
* DOCU: This will submit the creation of comment
* Triggered by: .on("submit", ".create_comment_form", submitCreateComment)
*/
function submitCreateComment(){
    let form = $(this);

    if(form.find(".textarea_comment_input").val() !== ""){
        $.post(form.attr("action"), form.serialize(), function(data){
            (data.status) ? $("#post_content_" + data.result.post_id).append(data.result.html) : alert(data.error);
        });
    }

    form[0].reset();
    return false;
}

/*
* DOCU: This will submit the deletion of comment
* Triggered by: .on("click", ".delete_comment_button", submitDeleteComment)
*/
function submitDeleteComment(){
    let delete_comment_button = $(this);
    let form = $("#delete_comment_form");

    form.find("#comment_id").val(delete_comment_button.data("comment-id"));
    
    $.post(form.attr("action"), form.serialize(), function(data){
        (data.status) ? delete_comment_button.closest(".comments_list li").remove() : alert(data.error);
    });

    return false;
}