(function() {
     function SongPlayer($rootScope, Fixtures) {
         
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
          * @function stopSong
          * @desc Stops current song in the currentBuzzObject
          * @param {Object} song
          */      
          var stopSong = function(song) {
                currentBuzzObject.stop();
                song.playing = null;   
          };
          
          /**
          * @function setSong
          * @desc Stops currently playing song and loads new audio file as currentBuzzObject
          * @param {Object} song
          */      
          var setSong = function(song) {
             if (currentBuzzObject) {
                stopSong(SongPlayer.currentSong);
             }
             currentBuzzObject = new buzz.sound(song.audioUrl, {
                 formats: ['mp3'],
                 preload: true
             });
              
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                     SongPlayer.currentTime = currentBuzzObject.getTime();
                     if (SongPlayer.currentTime >= SongPlayer.currentSong.duration) {
                         SongPlayer.next();
                         }
                });
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
         * @desc Current playback time (in seconds) of currently playing song
         * @type {Number}
         */
         SongPlayer.currentTime = null;
         
         /**
         * @desc Volume of currently playing song
         * @type {Number}
         */
         SongPlayer.volume = 80;
          
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
              song.playing = null;
          };
         
         /**
         * @function SongPlayer.previous
         * @desc Will move to the previous song in the song index
         */         
         SongPlayer.previous = function() {
             var currentSongIndex = getSongIndex(SongPlayer.currentSong);
             currentSongIndex--;
             
             if (currentSongIndex < 0) {
                 stopSong(SongPlayer.currentSong);
             } else {
                 var song = currentAlbum.songs[currentSongIndex];
                 setSong(song);
                 playSong(song);
             }
         };
         
         /**
         * @function SongPlayer.next
         * @desc Will move to the next song in the song index and play it
         */         
         SongPlayer.next = function() {
             var currentSongIndex = getSongIndex(SongPlayer.currentSong);
             currentSongIndex++;
             
             if (currentSongIndex >= currentAlbum.songs.length) {
                 var song = currentAlbum.songs[0];
                 setSong(song);
                 playSong(song);
             } else {
                 var song = currentAlbum.songs[currentSongIndex];
                 setSong(song);
                 playSong(song);
             }
         };
         
         /**
         * @function setCurrentTime
         * @desc Set current time (in seconds) of currently playing song
         * @param {Number} time
         */
         SongPlayer.setCurrentTime = function(time) {
             if (currentBuzzObject) {
                 currentBuzzObject.setTime(time);
             }
         };
         
         /**
         * @function setVolume
         * @desc Set volume of currently playing song
         * @param {Number} volume
         */
         SongPlayer.setVolume = function(volume) {
             if (currentBuzzObject) {
                 currentBuzzObject.setVolume(volume);
             }
         };
         
          return SongPlayer;
     }
 
     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();