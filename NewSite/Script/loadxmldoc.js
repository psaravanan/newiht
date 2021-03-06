function loadXMLDoc(dname) {
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", dname, false);
    xhttp.send();
    return xhttp.responseXML;
}

function selectPageFromXML(url, page_name) {

    xmlDoc = loadXMLDoc(url);
    console.log(xmlDoc);
    var pages = xmlDoc.getElementsByTagName("page");
    var result;
    $(pages).each(function () {
        console.log($(this).attr("name"));
        if ($(this).attr("name") == page_name) {
            result = $(this);
        }
    });
    return result;
}

function feedDataFromXML(url, page_name) {
    var page = selectPageFromXML(url, page_name);
    var result = page[0];
    var this_page_name = $(result).attr("name");
    var image = $(result).find("header image")[0];
    //var title = $(result).find("header title")[0];
    var short_description = $(result).find("header short_description")[0];
    var long_description = $(result).find("header long_description")[0];
    $(".inner-container-top .pagelogo img").attr("src", $(image).text());
    //$(".inner-container-top .pagelogo h1").text($(title).text());
    $(".inner-container-top .content-top .top_head").text($(short_description).text());
    $(".inner-container-top .content-top .bottom_head").text($(long_description).text());
    var menus = $(result).find("bottom menu");
    //$(".ser_container_ul").text('');
    $(".container_bottom").text('');
    var no_of_menus = menus.length;
    for (i = 0; i < menus.length; i++) {
        var strip_image = $($(menus[i]).find("images")[0]).find("image")[0];
        var inner_strip_image = $($(menus[i]).find("images")[0]).find("image")[1];
        var inner_bg_image = $($(menus[i]).find("images")[0]).find("image")[2];
        var menu_items = $(menus[i]).find("item");
        var list_of_items = '';

        for (j = 0; j < menu_items.length; j++) {
            var list_type = $(menu_items[j]).find("list_type").text();
            var item_name = '';
            var no_hand = '';
            var is_clickable = '';
            if ($(menu_items[j]).attr("url") == "true") {
                is_clickable = "check_service_detail";
            } else {
                is_clickable = "not_clickable";
            }
            if (list_type == "is_link") {
                item_name = $(menu_items[j]).find("list_name").text();
                is_clickable = "check_service_detail";
            } else if (list_type == "is_para") {
                no_hand = "no_hand";
                item_name = $(menu_items[j]).find("list_para").text();
            } else if (list_type == "is_image") {
                no_hand = "no_hand";
                item_name = "<img width='200px' src='" + $(menu_items[j]).find("inner_image").text() + "' />";
            }



            //list_of_items += "<li class='list_style_color " + no_hand + "'><a data-item-index='"+j+"' data-sibling-index='"+i+"' data-which-navigation='check_service_detail' class='" + is_clickable + "' href='#InnerPage.html' data-page-name='"
            //+ this_page_name + "' data-item-index='" + j + "' data-sibling-index='" + i + "' >" + item_name + "</a></li>";
            if (item_name.length > 120) {
                item_name = item_name.substr(0, 120) + "<span style='color:blue; font-size:11px; float:right; margin-top: 5px;'> Read more...</span>";
            }



            // for next and previous arrow

            if (page_name == "services") {
                var prev_item_val = j - 1;
                var next_item_val = j + 1;
                if (j == 0) {
                    if ((menu_items.length - 1) <= 0) {
                        prev_item_val = 0;
                    } else {
                        prev_item_val = menu_items.length - 1;
                    }
                }
                if (menu_items.length == (j + 1)) {
                    next_item_val = 0;
                }

                var next_prev_data = " data-prev-page='" + page_name + "' data-next-page='" + page_name + "' data-prev-item='" + prev_item_val + "' data-next-item='" + next_item_val + "'";
            } else {
                var prev_item_val = i - 1;
                var next_item_val = i + 1;
                if (i == 0) {
                    if ((menus.length - 1) <= 0) {
                        prev_item_val = 0;
                    } else {
                        prev_item_val = menus.length - 1;
                    }
                }
                if (menus.length == (i + 1)) {
                    next_item_val = 0;
                }

                var next_prev_data = " data-prev-page='" + page_name + "' data-next-page='" + page_name + "' data-prev-item='" + prev_item_val + "' data-next-item='" + next_item_val + "'";
            }


            list_of_items += "<li class='list_style_color " + no_hand + "'><a " + next_prev_data + " data-item-index='" + j + "' data-sibling-index='" + i + "' data-which-navigation='check_service_detail' class='" + is_clickable + "' href='#InnerPage.html' data-page-name='"
                                + this_page_name + "'>" + item_name + "</a></li>";
        }
        var is_last = '';
        if ((i + 1) == menus.length) { is_last = 'last' }
        $(".container_bottom").append("<div class='content_bottom'><ul class='ser_container_ul'><li " + next_prev_data + " href='#InnerPage.html' data-which-navigation='check_service_detail' class='slide-up "
                + is_clickable + "' style='background: url(" + $(strip_image).text() + ") no-repeat; background-size: 100% 23%; position: absolute;' data-page-name='"
                + this_page_name + "' data-item-index='0' data-sibling-index='" + i + "'><ul class='sub_ul'>" + list_of_items + "</ul></li></ul></div>");


        //<li href='#InnerPage.html' data-which-navigation='check_service_detail' class='slide-up " + is_clickable + "' data-page-name='"
        //+ this_page_name + "' data-item-index='0' data-sibling-index='" + i + "' style='background: url("
        //+ $(strip_image).text() + ") no-repeat;'> <ul class='sub_ul " + is_last + "'>"
        //+ list_of_items + "</ul> </li>");
    }
    //$(".ser_container_ul").css({"width" : (no_of_menus*253)+(no_of_menus*8)+"px", "margin" : "0 auto"});


    var numItems = $('.content_bottom').length;
    switch (numItems) {
        case 1:
            $(".content_bottom:first-child").css({ marginLeft: "500px" });
            $(".content_bottom:last-child").css({ marginRight: "150px" });
            break
        case 2:
            $(".content_bottom:first-child").css({ marginLeft: "30%" });
            $(".content_bottom:last-child").css({ marginRight: "20%" });
            break
        case 3:
            $(".content_bottom:first-child").css({ marginLeft: "25%" });
            $(".content_bottom:last-child").css({ marginRight: "15%" });
            break
        case 4:
            $(".content_bottom:first-child").css({ marginLeft: "15%" });
            $(".content_bottom:last-child").css({ marginRight: "8%" });
            break
        case 5:
            $(".content_bottom:first-child").css({ marginLeft: "-5%" });
            $(".content_bottom:last-child").css({ marginRight: "1%" });
            break
        case 6:
            $(".content_bottom:first-child").css({ marginLeft: "100px" });
            $(".content_bottom:last-child").css({ marginRight: "150px" });
            break
        case 7:
            $(".content_bottom:first-child").css({ marginLeft: "100px" });
            $(".content_bottom:last-child").css({ marginRight: "100px" });
            break
    }
    $("#bottomcontainer").mCustomScrollbar({
        horizontalScroll: true,
        theme: "light",
        autoHideScrollbar: false,
        scrollButtons: {
            enable: true
        }
    });
    //$(".mCSB_container").animate({ left: "-40%" }, 100);
    $(".mCSB_container").css("padding-left", "0");
    
}

function selectSibling(page_name, sibling_index, item_index) {
    var page = selectPageFromXML("Xml/all_pages.xml", page_name);
    var result = page[0];
    var menus = $(result).find("bottom menu");
    //var inner_strip_color = $($(result).find("bottom menu color")[0]).text();

    var list_of_items = '';
    var list_of_item_sublink = '';
    var current_opening_desc = '';
    var upload_resume_desc = '';
    var margin = 22;
    $(".details_page_left_list").text('');
    for (i = 0; i < menus.length; i++) {
        var inner_strip_image = $($(menus[i]).find("images")[0]).find("image")[1];
        var inner_bg_image = $($(menus[i]).find("images")[0]).find("image")[2];
        var inner_strip_color = $($(menus[i]).find("color")[0]).text();


        if (page_name != "services") {
            $(".inner_strip_color").css("border-left", "3px solid " + inner_strip_color);

            var menu_name = $($(menus[i]).find("menu_name")).text();
            margin = margin - 4;
            $(".details_page_left_img").attr("src", $(inner_strip_image).text());

            if (menu_name == "Current Openings") {
                current_opening_desc += "<div><b>Job Code:</b> IH - 004</br><b>Job Location:</b> Pondicherry</br><b>Job Description:</b> Position: .Net Developer / Sr. Dot Net Developer</br><b>Work Location:</b> Chennai (or) Pondicherry.</br><b>Required Technical Skill's:</b> We are looking for excellent .NET /C# technologies developer for our offshore development center.</div>";
            }
            if (menu_name == "Upload Resume") {
                upload_resume_desc += "<div><div><form name='upload_form'><span><label>Name: </label><input type='text' name='name' /></span><span><label>Email: </label><input type='email' name='email' /></span><span><label>Mobile Number: </label><input type='text' name='phone' /></span><span><label>Cover statement: </label><textarea rows='5' cols='20' name='desc'></textarea></span><span><label>Upload Resume: </label><input type='file' /></span><input type='submit' value='Submit'></form></div><span>OR</span><p>If you are interested in growing with us, do send us your resume through email to jobs@ihorsetechnologies.com or please walk-in with your resume at:</p></div>";
            }
            if (menu_name == "Team") {
                list_of_item_sublink += "<ul class='team_sublink'><li ><a style='font-size:11px; padding-left: 0px; margin-left: -33px; color: #1F92D1;' data-prev-page='about_us' data-next-page='about_us' data-prev-item='2' data-next-item='0' data-which-navigation='check_service_detail' class='check_service_detail' data-page-name='about_us' data-item-index='3' data-sibling-index='3' href='javascript:void(0);'>- Visionary</a></li>"
                + "<li  ><a style='font-size:11px; padding-left: 0px; margin-left: -46px; color: #99B23F;' data-prev-page='about_us' data-next-page='about_us' data-prev-item='2' data-next-item='0' data-which-navigation='check_service_detail' class='check_service_detail' data-page-name='about_us' data-item-index='3' data-sibling-index='3' href='javascript:void(0);'>- Executive</a></li><li ><a style='font-size:11px; padding-left: 0px; margin-left: -63px; color: #CF7814;' data-prev-page='about_us' data-next-page='about_us' data-prev-item='2' data-next-item='0' data-which-navigation='check_service_detail' class='check_service_detail' data-page-name='about_us' data-item-index='3' data-sibling-index='3' href='javascript:void(0);'>- Consultant</a></li></ul>"
            }

            // for next and previous arrow
            var prev_item_val = i - 1;
            var next_item_val = i + 1;
            if (i == 0) {
                if ((menus.length - 1) <= 0) {
                    prev_item_val = 0;
                } else {
                    prev_item_val = menus.length - 1;
                }
            }
            if (menus.length == (i + 1)) {
                next_item_val = 0;
            }
            if (menu_name.length > 27) {
                menu_name = menu_name.substr(0, 27) + "...";
            }
            var next_prev_data = " data-prev-page='" + page_name + "' data-next-page='" + page_name + "' data-prev-item='" + prev_item_val + "' data-next-item='" + next_item_val + "'";

            list_of_items += "<div style='margin-left:" + margin + "%'><a " + next_prev_data + " data-which-navigation='check_service_detail' class='check_service_description' href='javascript:void(0);' data-sibling-index='"
                                        + i + "' data-item-index='" + i + "' data-page-name='" + page_name + "'>" + menu_name + "</a>"
                                        + list_of_item_sublink + "</div>";
        }

        if (sibling_index == i) {
            $(".bg").attr("src", $(inner_bg_image).text());
            $(".bg").fadeIn();
            $(".mCSB_container").css('left', '58%');
            var items = $(menus[i]).find("item");
            for (j = 0; j < items.length; j++) {
                var list_type = $(items[j]).find("list_type").text();
                var item_name = '';
                if (list_type == "is_link") {
                    item_name = $(items[j]).find("list_name").text();
                } else if (list_type == "is_para") {
                    item_name = $(items[j]).find("list_para").text();
                } else if (list_type == "is_image") {
                    item_name = "<img src='" + $(items[j]).find("inner_image").text() + "' />";
                }
                if (page_name == "services") {

                    $(".inner_strip_color").css("border-left", "3px solid " + inner_strip_color);
                    //$("#menubox").css("border-left", "3px solid " +  inner_strip_color);
                    margin = margin - 4;
                    $(".details_page_left_img").attr("src", $(inner_strip_image).text());

                    // for next and previous arrow

                    var prev_item_val = j - 1;
                    var next_item_val = j + 1;
                    if (j == 0) {
                        if ((items.length - 1) <= 0) {
                            prev_item_val = 0;
                        } else {
                            prev_item_val = items.length - 1;
                        }
                    }
                    if (items.length == (j + 1)) {
                        next_item_val = 0;
                    }
                    var next_prev_data = " data-prev-page='" + page_name + "' data-next-page='" + page_name + "' data-prev-item='" + prev_item_val + "' data-next-item='" + next_item_val + "'";


                    list_of_items += "<div style='margin-left:" + margin + "%'><a " + next_prev_data + " data-which-navigation='check_service_detail' class='check_service_description' href='javascript:void(0);' data-sibling-index='"
                                                + i + "' data-item-index='" + j + "' data-page-name='" + page_name + "'>" + item_name + "</a></div>";
                }
                if (item_index == j) {
                    var header = $(items[j]).find('title').text();
                    var description = $(items[j]).find('description').text();

                    if (menu_name == "Current Openings") {
                        var messages = split_string(current_opening_desc);
                    } else if (menu_name == "Upload Resume") {
                        //var messages = split_string(upload_resume_desc);
                        //var messages = split_string(description);
                        var messages = [];
                        $.ajax({
                            //url: $(t).attr("href"),
                            url: "careers_form.html",
                            success: function (data) {

                                messages.push(data);
                                append_innerpage_right_text(messages, header);
                            }
                        });
                    } else {
                        var messages = split_string(description);
                    }
                    $(".mCSB_container").animate({ left: "-40%" }, 900);
                    $(".mCSB_dragger").animate({ left: "287px" }, 900);
                  //  $("#contentarea").css('margin-left', '-108px');
                    append_innerpage_right_text(messages, header);
                }
            }
        }
    }
    $(".details_page_left_list").html(list_of_items);
}

function showDescription(page_name, sibling_index, item_index) {
    $(".mCSB_container").css('left', '58%');
    var page = selectPageFromXML("Xml/all_pages.xml", page_name);
    var result = page[0];
    var menus = $(result).find("bottom menu");
    var current_opening_desc = '';
    var upload_resume_desc = '';
    // var inner_strip_color = $($(result).find("header color")[0]).text();
    var diff = $(".mCSB_container").width() - $(window).width();
    
    $(".mCSB_container").animate({ left: "-40%" }, 900);            // --------------------- on inner page link click
        $(".mCSB_dragger").animate({ left: "287px" }, 900);
    
    $(".whole_service_description").css({
        //"position": "relative"
        //"left": "530px",
        //"display": "none"
    });
    for (i = 0; i < menus.length; i++) {

        if (sibling_index == i) {
            var menu_name = $($(menus[i]).find("menu_name")).text();
            if (menu_name == "Current Openings") {
                current_opening_desc += "<div><b>Job Code:</b> IH - 004</br><b>Job Location:</b> Pondicherry</br><b>Job Description:</b> Position: .Net Developer / Sr. Dot Net Developer</br><b>Work Location:</b> Chennai (or) Pondicherry.</br><b>Required Technical Skill's:</b> We are looking for excellent .NET /C# technologies developer for our offshore development center.</div>";
            }
            if (menu_name == "Upload Resume") {
                upload_resume_desc += "<div><div class='upload_form_container'><form class='upload_form' name='upload_form'><span><label>Name: </label><input type='text' name='name' /></span><span><label>Email: </label><input type='email' name='email' /></span><span><label>Mobile Number: </label><input type='text' name='phone' /></span><span><label>Cover statement: </label><textarea rows='5' cols='20' name='desc'></textarea></span><span><label>Upload Resume: </label><input type='file' /></span><input type='submit' value='Submit'></form></div><span>OR</span><p>If you are interested in growing with us, do send us your resume through email to jobs@ihorsetechnologies.com or please walk-in with your resume at:</p></div>";
            }
            //$(".bg").hide().css("left", "1359px");
            var inner_img_path = $(menus[i]).find("images")[0];
            var inner_bg_image = $($(inner_img_path).find("image")[2]).text();
            var inner_strip_color = $($(menus[i]).find("color")[0]).text();

            //$(".bg").delay(500);
            $(".bg").attr("src", inner_bg_image);
            //$(".bg").show('slide', {direction: 'right'}, 200);
            var items = $(menus[i]).find("item");
            for (j = 0; j < items.length; j++) {

                if (page_name == "services") {

                    $("#menubox").css("border-left", "3px solid " + inner_strip_color + ";");
                    //$(".inner_strip_color").css("border-left", "3px solid black");
                    var current_item = items[j];
                    var current_item_index = item_index;
                } else {
                    var current_item = items[0];
                    var current_item_index = j;
                }

                if (current_item_index == j) {

                    var header = $(current_item).find('title').text();
                    var description = $(current_item).find('description').text();
                    var messages = [];
                    $(".details_page_right_header").text(header);
                    if (menu_name == "Current Openings") {
                        messages = split_string(current_opening_desc);
                        append_innerpage_right_text(messages, header);
                    } else if (menu_name == "Upload Resume") {
                        $.ajax({
                            url: "careers_form.html",
                            success: function (data) {
                                messages.push(data);
                                append_innerpage_right_text(messages, header);
                            }
                        });
                    } else {
                        messages = split_string(description);
                        append_innerpage_right_text(messages, header);
                    }
                }
            }
        }
    }
}
function append_innerpage_right_text(messages, header) {
    var description_with_page = '';
    var h = 0;
    $.each(messages, function (n, message) {
        if (h == 0) {
            $(".details_page_right_first_para").delay(2000).html(message);
            h = 1;
        } else {
            description_with_page += "<div class='reverseskew para'>" + message + "</div>";
        }
    });
    $(".details_page_right_first_para").next().next().html(description_with_page);
    //$(".details_page_right_para_containner").html(description_with_page);
    $(".details_page_right_header").text(header);

}
