import './icons.js'

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
        this.audio.src = this.songList[this.currentIndex].url
      })
  }

  bind() {
    const self = this
    this.root.querySelector('.btn-play-pause').onclick = function () {
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

    this.root.querySelector('.btn-pre').onclick = function () {
      self.playPreSong()
    }

    this.root.querySelector('.btn-next').onclick = function () {
      self.playNextSong()
    }
  }

  playPreSong() {
    this.currentIndex = (this.songList.length + this.currentIndex - 1) % this.songList.length
    this.audio.src = this.songList[this.currentIndex].url
    this.audio.play()
  }

  playNextSong() {
    this.currentIndex = (this.songList.length + this.currentIndex + 1) % this.songList.length
    this.audio.src = this.songList[this.currentIndex].url
    this.audio.play()
  }
}


window.p = new Player('#player')

