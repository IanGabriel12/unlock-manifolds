var unlockManifolds = {
  audio: {
    click: 'click.wav',
    complete: 'complete.wav',
    fail: 'fail.wav',

    loadAudios(){
      const path = './audio/';
      this.click = new Audio(path + this.click)
      this.complete = new Audio(path + this.complete)
      this.fail = new Audio(path + this.fail);

      this.click.load();
      this.complete.load();
      this.fail.load();
    },

    playAudio(audioName){
      this[audioName].play()
    }
  },

  interface: {
    panelButtons: [],
    panel: document.querySelector('.game-container'),
    endGameCooldown: 1000,

    loadPanelButtons(){
      for(let i=1; i<=10; i++){
        let panelButton = document.createElement('div');
        let panelButtonNumber = document.createTextNode(i);
        panelButton.classList.add('panel-button');
        panelButton.appendChild(panelButtonNumber);
        this.panelButtons.push(panelButton);
      }
    },

    shufflePanelButtons(){
      this.panel.innerHTML = "";
      let panelButtonsCopy = [...this.panelButtons];
      for(let i=0; i<this.panelButtons.length; i++){
        const buttonIndex = Math.floor(Math.random() * panelButtonsCopy.length);
        this.panel.appendChild(panelButtonsCopy[buttonIndex]);
        panelButtonsCopy.splice(buttonIndex, 1);
      }
    },

    disableButtons(){
      this.panelButtons.map((button) => {
        button.onclick = null;
      })
    },

    enableButtons(){
      this.panelButtons.map((button, index) => {
        button.onclick = () => unlockManifolds.game.handleButtonClick(index + 1);
      })
    },

    activateButton(buttonNumber){
      this.panelButtons[buttonNumber - 1].classList.add('active');
      this.panelButtons[buttonNumber - 1].onclick = null;
    },

    turnOffButtons(){
      this.panelButtons.map((button) => button.classList.remove('active'));
    },

    playLostAnimation(){
      this.turnOffButtons();
      const interval = setInterval(() => {
        this.panelButtons.map((button) => {
          button.classList.toggle('lost-animation');
        })
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        this.panelButtons.map((button) => {
          button.classList.remove('lost-animation');
        })
      }, this.endGameCooldown);
    },

    playWinAnimation(){
      const textElement = document.createElement('h1');
      textElement.innerHTML = "Tarefa completa!";
      textElement.classList.add('complete-text');
      document.querySelector('body').appendChild(textElement);

      setTimeout(() => {
        document.querySelector('body').removeChild(textElement);
      }, this.endGameCooldown)
    },

    endGame(gameStatus){
      this.disableButtons();
      if(gameStatus === 'lost'){
        unlockManifolds.audio.playAudio('fail');
        this.playLostAnimation();
      }else{
        unlockManifolds.audio.playAudio('complete');
        this.playWinAnimation();
      }

      setTimeout(() => {
        this.enableButtons();
        this.turnOffButtons();
        unlockManifolds.game.startGame();
      }, this.endGameCooldown);
    }
  },
  game: {
    nextNumber: 1,
    maxNumber: 10,

    handleButtonClick(buttonNumber){
      console.log('User has clicked: ', buttonNumber)
      if(buttonNumber == this.nextNumber){
        unlockManifolds.audio.playAudio('click');
        unlockManifolds.interface.activateButton(buttonNumber);

        if(buttonNumber == this.maxNumber){
          unlockManifolds.interface.endGame('won')
          return
        }
        this.nextNumber++;
      }else{
        unlockManifolds.interface.endGame('lost')
      }
    },

    startGame(){
      unlockManifolds.interface.shufflePanelButtons();
      unlockManifolds.interface.enableButtons();
      this.nextNumber = 1;
    }
  }
}

unlockManifolds.audio.loadAudios();
unlockManifolds.interface.loadPanelButtons();
unlockManifolds.game.startGame();