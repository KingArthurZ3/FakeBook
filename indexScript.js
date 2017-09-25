$(document).ready(function(){
    var db = firebase.database();
    var postBtn = document.querySelector('#postBtn');
    var postBox = document.querySelector('#postBox');
    var postTitleBox = document.querySelector('#postTitleBox');
    var logBtn = document.querySelector('#logBtn');
    var logoutBtn = document.querySelector('#logoutBtn');
    var refBtn = document.querySelector('#refBtn');

    $('#logoutBtn').hide();

    logBtn.addEventListener('click', function(){
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider);
    });

    logoutBtn.addEventListener('click', function(){
        firebase.auth().signOut();
    })

    var userObj = "";

    function uiRefresh(){
        $('#logoutBtn').hide();
        $('#logBtn').show();
        $("#display-name").text("");
    }

    function onAuthStateChanged(user){
        if(user){
            userObj = user
            //set global var userObj to user
            $("#display-name").text("Welcome, " + user.displayName + ".");

            $('#logoutBtn').show();
            $('#logBtn').hide();
        }
        else{
            uiRefresh();
        }

    }
    firebase.auth().onAuthStateChanged(onAuthStateChanged);

    postBtn.addEventListener('click', function(){
        //call writePost using userObj and value of the textarea
        writePost(userObj.uid, userObj.displayName, postBox.value, postTitleBox.value );
        showPost(userObj.displayName, postBox.value, postTitleBox.value);
    });

    function writePost(uid, username, body, title){
        var data = {
            author: username,
            uid: uid,
            title: title,
            body: body
        }
        //Push data to /posts/uid/
        db.ref('/posts/').push(data);
    }

    function showPost(username, body, title) {
        var textDiv = document.createElement('DIV');
        var titleDiv = document.createElement('DIV');
        var authorDiv = document.createElement('DIV');
        titleDiv.className += 'postTitle';
        titleDiv.innerHTML = title;
        authorDiv.className += 'postAuthor';
        authorDiv.innerHTML = 'by ' + username;
        textDiv.className += 'postText';
        textDiv.innerHTML = 'tbh ' + body;
        document.getElementById("postArea").appendChild(titleDiv);
        titleDiv.appendChild(authorDiv);
        titleDiv.appendChild(textDiv);
    }

    // refresh button should update page with all previous posts

    refBtn.addEventListener('click', function(){
        getPost(userObj.uid);
    });

    function getPost(userId){
        db.ref('posts/').once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {

                var childAuthor = childSnapshot.val().author;
                var childTitle = childSnapshot.val().title;
                var childBody = childSnapshot.val().body;

                var textDiv = document.createElement('DIV');
                var titleDiv = document.createElement('DIV');
                var authorDiv = document.createElement('DIV');
                titleDiv.className += 'postTitle';
                titleDiv.innerHTML = childTitle;
                authorDiv.className += 'postAuthor';
                authorDiv.innerHTML = 'by ' + childAuthor;
                textDiv.className += 'postText';
                textDiv.innerHTML = 'tbh ' + childBody;
                document.getElementById("postArea").appendChild(titleDiv);
                titleDiv.appendChild(authorDiv);
                titleDiv.appendChild(textDiv);

            });
        });
    }


});