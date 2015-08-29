/* global $ */
var REPOS_PER_LINE = 5;
var ghrepos = require('github-repositories');

function build_repos (repo_object) {
  return '<a href="' + repo_object.html_url + '">' + repo_object.name + '</a>';
}

function build_row (row_repos) {
  if (row_repos.length > REPOS_PER_LINE) {
    console.error('Number of repos more than that in one row!');
  }
  var this_row = '<tr>';
  for (var j = 0; j < row_repos.length; j++) {
    this_row += '<td>' + row_repos[j] + '</td>';
  }
  this_row += '</tr>';
  return this_row;
}

function group_into (object, num) {
  var num_rows = parseInt(object.length / num, 10);
  var grouped_obj = [];
  for (var i = 0; i < num_rows; i++) {
    var this_row = []
    for (var j = 0; j < num; j++) {
      this_row.push(object[i * num + j]);
    }
    grouped_obj.push(this_row);
  }
  var last_row = [];
  for (var k = num_rows * num; k < object.length; k++) {
    last_row.push(object[k]);
  }
  grouped_obj.push(last_row);
  return grouped_obj;
}

function find_repos (username) {
  ghrepos(username, function (err, body) {
    if (err) {
      console.error(err);
    }
    var html_strings = [];
    for (var i = 0; i < body.length; i++) {
      html_strings.push(build_repos(body[i]));
    }

    var rows = group_into(html_strings, 5);
    for (i = 0; i < rows.length; i++) {
      $('.placeholder').html($('.placeholder').html() + build_row(rows[i]));
    }
    $('h1#header').html('Done, showing ' + body.length + ' repositories! <i class="fa fa-thumbs-up"></i>');
  });
}

$('#username').on('submit', function (e) {
  e.preventDefault();
  $('#username').fadeOut();
  find_repos($('#username-val').val());
  $('h1#header').html('<i class="fa fa-circle-o-notch fa-spin"></i> talking with the GitHub API');
});

// $(document).ready(function () {
//   $('#username').fadeOut();
//   find_repos('icyflame');
//   $('h1#header').html('<i class="fa fa-circle-o-notch fa-spin"></i> talking with the GitHub API');
// });
