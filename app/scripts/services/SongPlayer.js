(function() {
     function SongPlayer(Fixtures) {
         
          /**
          * @desc  Song playing object
          * @type {Object}
          */   
          var SongPlayer = {};
         
          /**
          * @desc Gets the current Album info
          * @type {Object}
          */   
          var currentAlbum = Fixtures.getAlbum();
         
          /**
          * @desc Buzz object audio file
          * @type {Object}
          */   
          var currentBuzzObject = null;
          
          /**
          * @function setSong
          * @desc Stops currently playing song and loads new audio file as currentBuzzObject
          * @param {Object} song
          */      
          var setSong = function(song) {
             if (currentBuzzObject) {
                 currentBuzzObject.stop();
                 SongPlayer.currentSong.playing = null;
             }
 
             currentBuzzObject = new buzz.sound(song.audioUrl, {
                 formats: ['mp3'],
                 preload: true
             });
 
             SongPlayer.currentSong = song;
          };
          
          /**
          * @function playSong
          * @desc Plays current song in the currentBuzzObject
          * @param {Object} song
          */      
          var playSong = function(song) {
                currentBuzzObject.play();
                song.playing = true;   
          };
         
         /**
         * @function getSongIndex
         * @desc Returns the current album songs by index
         * @param {Object} song
         */
         var getSongIndex = function(song) {
             return currentAlbum.songs.indexOf(song);
         };
         
         /**
         * @desc Current song that is being acted upon
         * @type {Object}
         */   
          SongPlayer.currentSong = null;
          
          /**
          * @function SongPlayer.play
          * @desc Loads the currently playing song into currentBuzzObject or changes the the song if a differnt song is clicked
          * @param {Object} song
          */
          SongPlayer.play = function(song) {
              song = song || SongPlayer.currentSong;
              if (SongPlayer.currentSong !== song) {
                  setSong(song);
                  playSong(song);
              } else if (SongPlayer.currentSong === song) {
                  if (currentBuzzObject.isPaused()) {
                      playSong(song);
                  }
              }              
          };
         
          /**
          * @function SongPlayer.pause 
          * @desc Will pause the currently playing song
          * @param {Object} song
          */         
          SongPlayer.pause = function(song) {
              song = song || SongPlayer.currentSong;
              currentBuzzObject.pause();
              song.playing = false;
          };
         
         /**
         * @function SongPlayer.previous
         * @desc Will move to the previous song in the song index
         */         
         SongPlayer.previous = function() {
             var currentSongIndex = getSongIndex(SongPlayer.currentSong);
             currentSongIndex--;
             
             if (currentSongIndex < 0) {
                 currentBuzzObject.stop();
                 SongPlayer.currentSong.playing = null;
             } else {
                 var song = currentAlbum.songs[currentSongIndex];
                 setSong(song);
                 playSong(song);
             }
         };
         
          return SongPlayer;
     }
 
     angular
         .module('blocJams')
         .factory('SongPlayer', SongPlayer);
 })();