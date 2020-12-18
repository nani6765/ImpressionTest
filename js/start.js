const header = document.getElementById('header');
const footer = document.getElementById('footer');

const wrap = document.getElementById('wrap');
const qna = document.getElementById('qna');
const u_name = document.querySelector('input[type=text]');

const tabletMQL = window.matchMedia('all and (min-width: 768px)');
const pcMQL = window.matchMedia('all and (min-width: 1024px)');

//12개의 질문
const ENDPOINT = 12;
//선택한 배열
const select = [];
let qIdx = -1;

//스코어 계산
/*
const calcScore = () => {
	let point = 0;
	for (let i = 0; i < ENDPOINT; i++) {
		//선택한 배열을 돌면서 score점수를 가져와 합산
		point += qnaList[i].a[select[i]].score;
	}
	return point;
};
*/

const calcScore = () => {
	var pointArray = [
		{ name : 'mouse', value: 0, key: 0},
		{ name : 'cow', value: 0, key: 1},
		{ name : 'tiger', value: 0, key: 2},
		{ name : 'rabbit', value: 0, key: 3},
		{ name : 'dragon', value: 0, key: 4},
		{ name : 'snake', value: 0, key: 5},
		{ name : 'horse', value: 0, key: 6},
		{ name : 'sheep', value: 0, key: 7},
		{ name : 'monkey', value: 0, key: 8},
		{ name : 'chick', value: 0, key: 9},
		{ name : 'dog', value: 0, key: 10},
		{ name : 'pig', value: 0, key: 11},
	];
	
	for (let i = 0; i < ENDPOINT; i++) {
		var target = qnaList[i].a[select[i]];
		for (let j=0; j < target.type.length; j++){
			for(let k=0; k < pointArray.length; k++){
				if(target.type[j] === pointArray[k].name){
					pointArray[k].value = pointArray[k].value + 1;
				}
			}
		 }
	}
	
	console.log("pointArray : ", pointArray);

	let resultArray = pointArray.sort(function(a, b){
		if( a.value > b.value){
			return 1;
		}
		if (a.value < b.value){
			return -1;
		}
		return 0;
	});
	console.log("resultArray", resultArray);
	
	let resultword = resultArray[0].key;
	console.log("resultword", resultword);
	return resultword;
}

const goResult = () => {
	//pc 
	if (pcMQL.matches) {
		console.log('PC');
		wrap.style.marginTop = '150px';
	//tablet
	} else if (tabletMQL.matches) {
		console.log('tablet');
		wrap.style.marginTop = '115px';
	}
		
	const result = document.getElementById('result');
	const point = calcScore(); //return point
	
	const pTitle = document.querySelector('.p'); 
	pTitle.innerHTML = u_name.value + ' 님의 결과는?!';
	
	
	//이미지 이름을 image-`grade`.png로 저장할 것
	const img_url = 'img/image-' + point + '.png';
	//https://www.w3schools.com/jsref/met_document_createelement.asp
	const res_img = document.createElement('img');
	res_img.src = img_url; //img.src
	res_img.alt = infoList[grade].name; //img.alt
	res_img.title = infoList[grade].name; //img.title = img.name
	
	//https://developer.mozilla.org/ko/docs/Web/API/Node/appendChild
	const res_img_div = document.querySelector('.art');
	res_img_div.appendChild(res_img);
	
	const animal = document.querySelector('.result');
	animal.innerHTML = infoList[point].name;
	
	//description
	const desc = document.querySelector('.res');
	desc.innerHTML = infoList[point].desc;
	
	//https://developer.mozilla.org/ko/docs/Web/API/WindowTimers/setTimeout
	//0.6초
	setTimeout(() => {
		header.style.display = 'block';
		footer.style.display = 'block';
		result.style.display = 'block';
		header.style.animation = 'fade-in 0.3s forwards';
		footer.style.animation = 'fade-in 0.3s forwards';
		result.style.animation = 'going-up 0.5s, ' + 'fade-in 0.5s forwards';
	}, 600);
};

const end = () => {
	qna.style.animation = '';
	//https://www.w3schools.com/jsref/met_win_setinterval.asp
	//주기적으로 흐려지며 y축으로 사라짐
	const interval = setInterval(() => {
		qna.style.opacity -= 0.1;
		qna.style.transform = 'translateY(-1px)';
	}, 50);
	
	//https://www.w3schools.com/jsref/met_win_cleartimeout.asp
	//timeout 지정 해제
	setTimeout(() => clearTimeout(interval), 500);
	//qna display 지움
	setTimeout(() => (qna.style.display = 'none'), 500);
	
	//계산중인 화면 등장
	setTimeout(() => {
		const calc = document.getElementById('calc');
		calc.style.display = 'block';
		calc.style.animation = 'going-up 0.5s forwards, ' + 'fade-in 0.5s forwards';
	}, 700);
	
	//계산중인 화면 사라짐
	setTimeout(() => {
		calc.style.animation = '';
		calc.style.animation = 'going-left 0.4s forwards, ' + 'fade-out 0.4s forwards';
		setTimeout(() => {
			calc.style.display = 'none';
			//goResult
			goResult();
		}, 400);
	}, 9000);
};

//goNext : addAnswer(qNum.a[i].answer, i);
const addAnswer = (answerTxt, idx) => {
	const answer = document.createElement('button');
	answer.className += 'a box';
	answer.innerHTML = answerTxt;
	
	answer.addEventListener('click', () => {
		
		const parent = answer.parentNode;
		const children = parent.childNodes;
		for (let i in children) {
			children[i].disabled = true;
		}
		
		//face-out-5-4가 뭐하는건질 모르겠네..
		parent.classList.add('fade-out-5-4');
		setTimeout(() => {
			select[qIdx] = idx;
			a.innerHTML = '';
			parent.classList.remove('fade-out-5-4');
			goNext();
		}, 800);
	});

	setTimeout(
		() => (answer.style.animation = 'going-down 0.25s forwards, fade-in 0.25s forwards'), 50
	);
	const a = document.querySelector('.answer');
	a.appendChild(answer);
};

const goNext = () => {
	if (qIdx++ === qnaList.length - 1) {
		//qnaList를 다 돌았으면 end로
		end();
		return;
	}

	const status = document.querySelector('.status');
	status.style.width = (100/ENDPOINT) * (qIdx + 1) + '%';
	
	const qNum = qnaList[qIdx];
	const q = document.querySelector('.q');
	q.innerHTML = qNum.q;
	
	//const qna = document.getElementById('qna');
	qna.style.animation =
		'fade-in 0.3s ease-in-out 0.4s forwards, ' + 'going-down 0.3s ease-in-out 0.4s forwards';

	setTimeout(() => {
		//endIdx는 없어도 되지 않나..?
		const endIdx = qNum.a.length - 1;
		for (let i in qNum.a) {
			addAnswer(qNum.a[i].answer, i);
		}
		qna.style.opacity = 1;
	}, 700);
};

const begin = () => {
	const main = document.getElementById('main');
	header.style.animation = 'going-up 0.4s forwards, ' + 'fade-out 0.4s forwards';
	footer.style.animation = 'going-down 0.4s forwards, ' + 'fade-out 0.4s forwards';
	setTimeout(
		() =>
			(main.style.animation =
				'going-up 0.4s ease-in-out forwards, ' + 'fade-out 0.4s ease-in-out forwards'),
		500
	);
	setTimeout(() => {
		header.style.display = 'none';
		footer.style.display = 'none';
		main.style.display = 'none';
		qna.style.display = 'block';
		if (pcMQL.matches) {
			console.log('PC');
			wrap.style.marginTop = '50px';
		} else if (tabletMQL.matches) {
			console.log('tablet');
			wrap.style.marginTop = '30px';
		}
		goNext();
	}, 1000);
};

const load = () => {
	const msg = document.querySelector('.check-name');
	const start_btn = document.querySelector('.start');

	u_name.addEventListener('blur', () => {
		try {
			if (u_name.value.length < 1) {
				throw '이름을 입력하고 시작해 주세요.';
			}
			msg.innerHTML = '';
		} catch (err) {
			msg.innerHTML = err;
		}
	});

	start_btn.addEventListener('click', () => {
		try {
			if (u_name.value.length < 1) {
				throw '이름을 입력하고 시작해 주세요.';
			}
			msg.innerHTML = '';
			start_btn.disabled = true;
			begin();
		} catch (err) {
			msg.innerHTML = err;
		}
	});
};

window.onload = load();