"use strict";

//global var
let trackIndex = -1;

//load the json with an async function
async function loadJSON() {
  const url = 'js/albums-blog.json';
	const response = await fetch(url);
	return response.json();
}

//function to build the blog
async function buildBlog(matchingTitle) {
	const albums = await loadJSON();
  //console.log(albumCollection);
  let index = -1;
  for (let i=0;i<albums.length;i++) {
    if (albums[i].title == matchingTitle) {
      index = i;
    }
  }
  const albumCurrent = albums[index];
  
  //all review contents in order of appearance
  const post = document.createElement("div"); //pseudo blog-post container for elements
    post.className = "postContainer themed";
  
	const title = document.createElement("h3"); //album title
    title.textContent = albumCurrent.title;
  
  const details = document.createElement("h5"); //album details (artist, release date)
    details.textContent = "By " + albumCurrent.artist + ", Released " + albumCurrent.releaseDate;
  
	const artwork = document.createElement("img"); //artwork image
    artwork.src = albumCurrent.artwork;
    artwork.alt = albumCurrent.title + " album artwork";
    artwork.className = "mainArtwork";
  const artworkContainer = document.createElement("div"); //container for artwork
    artworkContainer.className = "artworkContainer";
    artworkContainer.appendChild(artwork);
  
  
  const reviewTitle = document.createElement("h3"); //title of the review
    reviewTitle.textContent = '"' + albumCurrent.reviewTitle + '"';
    reviewTitle.className = "reviewTitle";
  
  const reviewDetails = document.createElement("h5"); //the review details (rating and date)
    reviewDetails.textContent = "Album rating: " + albumCurrent.rating + ", Posted " + albumCurrent.reviewDate;
  
  const reviewBodyContainer = document.createElement("div"); //container for the review body
    reviewBodyContainer.className = "reviewBodyContainer";
	const reviewBody = document.createElement("p"); //p element for the body container
    reviewBody.textContent = albumCurrent.reviewBody;
    reviewBody.className = "reviewBody";
    reviewBody.id = "body";
    reviewBodyContainer.appendChild(reviewBody); //append body to container
  const reviewBodyContainerBtn = document.createElement("button"); //expand-shrink button (with event listener)
    reviewBodyContainerBtn.className = "reviewBodyContainerBtn";
    reviewBodyContainerBtn.textContent = "Show More";
    reviewBodyContainerBtn.id = "reviewBodyContainerBtn";
    reviewBodyContainerBtn.addEventListener("click", function() {
      let bodyStyle = this.previousSibling;
      if (bodyStyle.classList.contains("expandedBody")) {
        bodyStyle.scrollTop = 0;
        bodyStyle.classList.remove("expandedBody");
        this.textContent = "Show More";
      } else {
        bodyStyle.scrollTop = 0;
        bodyStyle.classList.add("expandedBody");
        this.textContent = "Show Less";
      }
    });
  
  //add album review elements to albumReviewBodyContainer
  const albumReviewBodyContainer = document.createElement("div");
    albumReviewBodyContainer.className = "albumReviewBodyContainer";
    albumReviewBodyContainer.appendChild(reviewTitle);
    albumReviewBodyContainer.appendChild(reviewDetails);
    albumReviewBodyContainer.appendChild(reviewBodyContainer);
    albumReviewBodyContainer.appendChild(reviewBodyContainerBtn);
  
  //individual tracks section
  const trackSectionTitle = document.createElement("h3"); //title element for the track listing section
    trackSectionTitle.textContent = "Track Reviews";
  
  const currentTrack = document.createElement("div"); //interactive container box for the individual tracks reviews
    currentTrack.className = "trackReviewsContainer";
    currentTrack.id = "currentTrackReview";
  
  //Print all tracknames
  /*albumCurrent.tracks.forEach(function(i) {
    const trackTitle = document.createElement("h5");
      trackTitle.textContent = '"' + i.title + '"';
    currentTrack.appendChild(trackTitle);
  });*/
  
  //instantiate the trackIndex to 0 (for first track)
  trackIndex = 0;
  
  const trackButtonsContainer = document.createElement("div");
    trackButtonsContainer.className = "trackButtonsContainer";
  const nextTrackButton = document.createElement("button");
    nextTrackButton.innerHTML = "Next";
    nextTrackButton.className = "changeTrackReviewButton nextTrackButton";
    nextTrackButton.addEventListener("click", function() {
      if (trackIndex !== albumCurrent.tracks.length-1) {
        trackIndex++;
      } else {
        trackIndex = 0;
      }
      changeTrackReview(albumCurrent.tracks[trackIndex], trackIndex);
    });
  const previousTrackButton = document.createElement("button");
    previousTrackButton.innerHTML = "Previous";
    previousTrackButton.className = "changeTrackReviewButton previousTrackButton";
    previousTrackButton.addEventListener("click", function() {
      if (trackIndex !== 0) {
        trackIndex--;
      } else {
        trackIndex = albumCurrent.tracks.length-1;
      }
      changeTrackReview(albumCurrent.tracks[trackIndex], trackIndex);
    });
  
  trackButtonsContainer.appendChild(previousTrackButton);
  trackButtonsContainer.appendChild(nextTrackButton);
  
  const artworkBodyFlexbox = document.createElement("div");
    artworkBodyFlexbox.className = "artworkBodyFlexbox";
    artworkBodyFlexbox.appendChild(artworkContainer);
    artworkBodyFlexbox.appendChild(albumReviewBodyContainer);
  
  //add ell elements to the main post element
	post.appendChild(title);
	post.appendChild(details);
	post.appendChild(artworkBodyFlexbox);
  post.appendChild(trackSectionTitle);
  post.appendChild(currentTrack);
  post.appendChild(trackButtonsContainer);
  //add main post element (containing all sub-elements) to the DOM
  document.getElementById('blogContent').appendChild(post);
  
  //add first album track's review
  changeTrackReview(albumCurrent.tracks[trackIndex], trackIndex)
}

buildBlog("Sgt. Pepper's Lonely Hearts Club Band");

//insert a button fixed to bottom right (nearest thumb on mobile) to scroll to top (dynamically inserted through JS so it will only appear if Js is enabled, because it relies on scripting to operate and wouldn't make sense if it was there and didn't do anything)
const topScrollBtn = document.createElement("button");
topScrollBtn.textContent = "Scroll to top";
topScrollBtn.className = "topScrollBtn";
topScrollBtn.addEventListener("click", function() {
  //will smooth scroll without library
  function tempLoop() {
    if (window.scrollY !== 0) {
      window.scroll({ top:window.scrollY-25 });
      setTimeout(function (){
        tempLoop();
      }, 1000/144)
    }
  };
  tempLoop();
});
document.getElementById("topScrollContainer").appendChild(topScrollBtn);
//only display when the user has scrolled down a bit
window.addEventListener("scroll", function() {
  if (window.scrollY > 100) {
    document.getElementById("topScrollContainer").style.visibility = "visible";
  } else {
    document.getElementById("topScrollContainer").style.visibility = "hidden";
  }
});

//function for scrolling through the track reviews (like a presentation)
function changeTrackReview(trackObject, index) {
  let currentTrackContainer = document.getElementById("currentTrackReview");
  if (document.getElementById("currentTrackReviewContainer")) {
    document.getElementById("currentTrackReviewContainer").style.opacity = 0;
  }
  setTimeout(function() {
    
    currentTrackContainer.innerHTML = "";
  
    let currentTrackReviewContainer = document.createElement("div");
      currentTrackReviewContainer.className = "currentTrackReviewContainer";
      currentTrackReviewContainer.id = "currentTrackReviewContainer";
    
    let trackTitle = document.createElement("h3");
      trackTitle.textContent = "Track " + (index+1) + ": " + trackObject['title'];
    
    let videoEmbed = document.createElement("div");
      videoEmbed.className = "youtubeEmbedContainer";
    let video = document.createElement("iframe");
      video.className = "youtubeEmbed";
      video.src = `https://www.youtube.com/embed/${trackObject['yt-id']}`;
      video.title = `YouTube Video Player - ${trackObject.title}`;
      video.setAttribute("frameborder", "0");
      video.setAttribute("allowfullscreen", "");
    videoEmbed.appendChild(video);
    
    let reviewTitle = document.createElement("h3");
      reviewTitle.className = "reviewTitle";
      reviewTitle.textContent = `"${trackObject['reviewTitle']}"`;
    
    let reviewRating = document.createElement("h5");
      reviewRating.className = "reviewTitle";
      reviewRating.textContent = `Rating: ${trackObject['rating']}`;
    
    let trackReviewContainer = document.createElement("div");
      trackReviewContainer.className = "reviewBodyContainer";
    let trackReviewBody = document.createElement("p");
      trackReviewBody.className = "reviewBody";
      trackReviewBody.id = "trackReviewBody";
      trackReviewBody.textContent = trackObject['reviewBody'];
    trackReviewContainer.appendChild(trackReviewBody);
    
    const trackReviewBodyContainerBtn = document.createElement("button"); //expand-shrink button (with event listener)
      trackReviewBodyContainerBtn.className = "reviewBodyContainerBtn";
      trackReviewBodyContainerBtn.textContent = "Show More";
      trackReviewBodyContainerBtn.id = "reviewBodyContainerBtn";
      trackReviewBodyContainerBtn.addEventListener("click", function() {
        let reviewBody = this.previousSibling;
        if (reviewBody.classList.contains("expandedBody")) {
          reviewBody.scrollTop = 0;
          reviewBody.classList.remove("expandedBody");
          this.textContent = "Show More";
        } else {
          reviewBody.scrollTop = 0;
          reviewBody.classList.add("expandedBody");
          this.textContent = "Show Less";
        }
      });
  
    
    currentTrackReviewContainer.appendChild(trackTitle);
    
    const trackBodyFlexbox = document.createElement("div");
      trackBodyFlexbox.className = "trackBodyFlexbox";
    trackBodyFlexbox.appendChild(videoEmbed);
    const trackReviewTextContainer = document.createElement("div");
      trackReviewTextContainer.className = "trackReviewTextContainer";
      trackReviewTextContainer.appendChild(reviewTitle);
      trackReviewTextContainer.appendChild(reviewRating);
      trackReviewTextContainer.appendChild(trackReviewContainer);
      trackReviewTextContainer.appendChild(trackReviewBodyContainerBtn);
    trackBodyFlexbox.appendChild(trackReviewTextContainer);
    
    currentTrackReviewContainer.appendChild(trackBodyFlexbox);
    currentTrackContainer.appendChild(currentTrackReviewContainer);
    
    document.getElementById("currentTrackReviewContainer").style.opacity = 1;
    
  }, 200);
  
  //reload darkmode after all the blog elements are loaded
  reloadDarkMode();
}



