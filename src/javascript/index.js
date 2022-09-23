import './icons.js'
import Swiper from './swiper'

class Player {
  constructor(node) {
    this.root = typeof node === 'string' ? document.querySelector(node) : node
    this.$ = selector => this.root.querySelector(selector)
    this.$$ = selector => this.root.querySelectorAll(selector)
    this.songList = []
    this.currentIndex = 0
    this.audio = new Audio()
    this.start()
    this.bind()
  }

  start() {
    fetch('https://jirengu.github.io/data-mock/huawei-music/music-list.json')
      .then(res => res.json())
      .then(data => {
        this.songList = data
        this.renderSong()
      })
  }

  bind() {
    const self = this
    this.$('.btn-play-pause').onclick = function () {
      if (this.classList.contains('playing')) {
        self.audio.pause()
        this.classList.remove('playing')
        this.classList.add('pause')
        this.querySelector('use').setAttribute('xlink:href', '#icon-pause')
      } else if (this.classList.contains('pause')) {
        self.audio.play()
        this.classList.remove('pause')
        this.classList.add('playing')
        this.querySelector('use').setAttribute('xlink:href', '#icon-play')
      }
    }

    this.$('.btn-pre').onclick = function () {
      self.playPreSong()
    }

    this.$('.btn-next').onclick = function () {
      self.playNextSong()
    }

    const swiper = new Swiper(this.$('.panels'))
    swiper.on('swipLeft', function () {
      this.classList.remove('panel1')
      this.classList.add('panel2')
    })
    swiper.on('swipRight', function () {
      this.classList.remove('panel2')
      this.classList.add('panel1')
    })
  }

  renderSong() {
    const songObj = this.songList[this.currentIndex]
    this.$('.header h1').innerText = songObj.title
    this.$('.header p').innerText = songObj.author + '-' + songObj.album
    this.audio.src = songObj.url
    this.loadLyrics()
  }

  checkPause() {
    const self = this.$('.btn-play-pause')
    if (self.classList.contains('pause')) {
      self.classList.remove('pause')
      self.classList.add('playing')
      self.querySelector('use').setAttribute('xlink:href', '#icon-play')
    }
  }

  playPreSong() {
    this.currentIndex = (this.songList.length + this.currentIndex - 1) % this.songList.length
    this.audio.src = this.songList[this.currentIndex].url
    this.renderSong()
    this.checkPause()
    this.audio.oncanplaythrough = () => this.audio.play()
  }

  playNextSong() {
    this.currentIndex = (this.songList.length + this.currentIndex + 1) % this.songList.length
    this.audio.src = this.songList[this.currentIndex].url
    this.renderSong()
    this.checkPause()
    this.audio.oncanplaythrough = () => this.audio.play()
  }

  loadLyrics() {
    fetch(this.songList[this.currentIndex].lyric)
      .then(res => res.json())
      .then(data => {
        console.log(data.lrc.lyric)
      })
  }
}


new Player('#player')

