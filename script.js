```javascript
document.addEventListener("DOMContentLoaded", function () {
  
  // JavaScriptが正常に読み込めたら、CSSにそれを伝えるクラスを追加
  document.body.classList.add("js-active");

  // ==========================================
  // 1. STAR CONSTELLATION BACKGROUND (星図背景アニメーション)
  // ==========================================
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");

  let particles = [];
  const colors = ["#dfb260", "#c59b48", "#92223a"];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let mouse = { x: null, y: null, radius: 120 };
  window.addEventListener("mousemove", function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  window.addEventListener("mouseleave", function () {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.15;
      this.speedY = (Math.random() - 0.5) * 0.15;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          let angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1;
          this.y -= Math.sin(angle) * force * 1;
        }
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  const particleCount = Math.min(45, Math.floor(window.innerWidth / 30));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // 近くの点を美しい線で結んで星座にする
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(223, 178, 96, " + (0.05 * (1 - dist / 150)) + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animateParticles);
  }
  animateParticles();


  // ==========================================
  // 2. SCROLL EFFETS & FADE INS
  // ==========================================
  const scrollTriggers = document.querySelectorAll('.scroll-trigger');
  
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  scrollTriggers.forEach(trigger => {
    scrollObserver.observe(trigger);
  });


  // ==========================================
  // 3. RESEARCH FIELDS TAB SYSTEM
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      tabPanels.forEach(panel => panel.classList.remove('active'));
      
      const targetTab = button.dataset.tab;
      const targetPanel = document.getElementById(targetTab);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });


  // ==========================================
  // 4. MOBILE MENU TOGGLE
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      const spans = mobileMenuBtn.querySelectorAll('span');
      spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
      spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
      spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
    });
  }

  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const spans = mobileMenuBtn.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });


  // ==========================================
  // 5. RANDOMIZED QUIZ SYSTEM (毎回ランダム3題出題)
  // ==========================================
  const quizPool = [
    {
      q: "「天動説」に疑問を呈し、望遠鏡で木星の衛星を発見して地動説を裏付けた学者は誰？",
      o: ["アイザック・ニュートン", "ニコラウス・コペルニクス", "ガリレオ・ガリレイ", "ロバート・フック"],
      a: 2
    },
    {
      q: "湯船から溢れる水を見て、金王冠の純度を測る「浮力」を発見し、「エウレカ！」と叫んだ古代の学者は？",
      o: ["ソクラテス", "アルキメデス", "アリストテレス", "ピタゴラス"],
      a: 1
    },
    {
      q: "りんごが木から落ちるのを見て不変の「万有引力の法則」をまとめ上げたイギリスの古典物理学者は？",
      o: ["アイザック・ニュートン", "マイケル・ファラデー", "チャールズ・ダーウィン", "ロバート・ボイル"],
      a: 0
    },
    {
      q: "自作の顕微鏡でコルク片を観察し、人類史上初めて「細胞（Cell）」と名付けた学者は？",
      o: ["グレゴール・メンデル", "ルイ・パスツール", "ロバート・フック", "アントニ・レーウェンフック"],
      a: 2
    },
    {
      q: "エンドウ豆を用いた長い交配実験から、遺伝に隠された3つの絶対的ルールを発見した生物学者は？",
      o: ["チャールズ・ダーウィン", "グレゴール・メンデル", "ジャン＝バティスト・ラマルク", "トーマス・モーガン"],
      a: 1
    },
    {
      q: "雷が電気現象であることを証明するため、嵐の日に凧を揚げる命がけの実験を行った人物は？",
      o: ["アレキサンダー・ボルタ", "トーマス・エジソン", "ベンジャミン・フランクリン", "ニコラ・テスラ"],
      a: 2
    },
    {
      q: "元素を原子量順に並べ、未知の元素の存在を正確に予言して周期表を作り上げたロシアの化学者は？",
      o: ["アントワーヌ・ラヴォアジエ", "ドミトリ・メンデレーエフ", "アルフレッド・ノーベル", "ジョン・ドルトン"],
      a: 1
    },
    {
      q: "100トン以上の重量物をも吊り上げる「動滑車」の有用性を、シラクサの王の前でたった1人で証明した学者は？",
      o: ["アルキメデス", "ヘロン", "エウクレイデス", "アナクシマンドロス"],
      a: 0
    }
  ];

  let activeQuizQuestions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let canAnswer = true;

  const startScreen = document.getElementById("quiz-start-screen");
  const gameScreen = document.getElementById("quiz-game-screen");
  const resultScreen = document.getElementById("quiz-result-screen");
  const progressFill = document.getElementById("quiz-progress-fill");
  const questionNumText = document.getElementById("quiz-question-number");
  const questionText = document.getElementById("quiz-question-text");
  const optionsContainer = document.getElementById("quiz-options-container");
  const finalScoreText = document.getElementById("quiz-final-score");
  const rankText = document.getElementById("quiz-rank-text");

  // クイズスタート
  const startBtn = document.getElementById("start-quiz-btn");
  if (startBtn) {
    startBtn.addEventListener("click", function () {
      const shuffled = [...quizPool].sort(() => 0.5 - Math.random());
      activeQuizQuestions = shuffled.slice(0, 3);
      
      currentQuestionIndex = 0;
      score = 0;
      
      startScreen.style.display = "none";
      resultScreen.style.display = "none";
      gameScreen.style.display = "block";
      
      showQuestion();
    });
  }

  // 問題を表示
  function showQuestion() {
    canAnswer = true;
    const currentQ = activeQuizQuestions[currentQuestionIndex];
    
    progressFill.style.width = ((currentQuestionIndex + 1) / 3 * 100) + "%";
    questionNumText.textContent = "第 " + (currentQuestionIndex + 1) + " / 3 問";
    questionText.textContent = currentQ.q;
    
    optionsContainer.innerHTML = "";
    
    currentQ.o.forEach((option, idx) => {
      const button = document.createElement("button");
      button.className = "quiz-opt-btn";
      button.textContent = option;
      button.addEventListener("click", () => selectOption(idx, button));
      optionsContainer.appendChild(button);
    });
  }

  // 回答選択
  function selectOption(selectedIdx, selectedButton) {
    if (!canAnswer) return;
    canAnswer = false;
    
    const currentQ = activeQuizQuestions[currentQuestionIndex];
    const buttons = optionsContainer.querySelectorAll(".quiz-opt-btn");
    
    if (selectedIdx === currentQ.a) {
      selectedButton.classList.add("correct");
      score++;
    } else {
      selectedButton.classList.add("wrong");
      buttons[currentQ.a].classList.add("correct");
    }
    
    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < 3) {
        showQuestion();
      } else {
        showResults();
      }
    }, 1500);
  }

  // 結果発表
  function showResults() {
    gameScreen.style.display = "none";
    resultScreen.style.display = "block";
    
    finalScoreText.textContent = score + " / 3";
    
    let rank = "";
    if (score === 3) {
      rank = "「大賢者」—— すべての古典真理を解き明かし者";
    } else if (score === 2) {
      rank = "「先駆的研究者」—— 偉大な発見の核心を捉えし者";
    } else {
      rank = "「見習い錬金術師」—— 知的好奇心の海をこれから泳ぎ出す者";
    }
    rankText.textContent = rank;
  }

  // 再挑戦
  const restartBtn = document.getElementById("restart-quiz-btn");
  if (restartBtn) {
    restartBtn.addEventListener("click", function () {
      resultScreen.style.display = "none";
      startScreen.style.display = "block";
    });
  }


  // ==========================================
  // 6. SYSTEM CLOCK / FOOTER TIMESTAMP
  // ==========================================
  const clockElement = document.getElementById('techClock');
  
  function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    const dateString = now.toISOString().slice(0, 10).replace(/-/g, '/');
    if (clockElement) {
      clockElement.innerHTML = '<span style="color: rgba(223,178,96,0.4)">ACADEMIA_LOG //</span> ' + dateString + ' ' + timeString + ' <span style="color: var(--color-primary)">// ACTIVE</span>';
    }
  }
  
  setInterval(updateClock, 1000);
  updateClock();

});

```
