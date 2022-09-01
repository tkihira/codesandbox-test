const prefInfoMap = {};
const prefIds = [];
const prefNames = {
	Hokkaido: "北海道",
	Aomori: "青森県",
	Iwate: "岩手県",
	Miyagi: "宮城県",
	Akita: "秋田県",
	Yamagata: "山形県",
	Fukushima: "福島県",
	Ibaraki: "茨城県",
	Tochigi: "栃木県",
	Gumma: "群馬県",
	Saitama: "埼玉県",
	Chiba: "千葉県",
	Tokyo: "東京都",
	Kanagawa: "神奈川県",
	Nigata: "新潟県",
	Toyama: "富山県",
	Ishikawa: "石川県",
	Fukui: "福井県",
	Yamanashi: "山梨県",
	Nagano: "長野県",
	Gifu: "岐阜県",
	Shizuoka: "静岡県",
	Aichi: "愛知県",
	Mie: "三重県",
	Shiga: "滋賀県",
	Kyoto: "京都府",
	Osaka: "大阪府",
	Hyogo: "兵庫県",
	Nara: "奈良県",
	Wakayama: "和歌山県",
	Tottori: "鳥取県",
	Shimane: "島根県",
	Okayama: "岡山県",
	Hiroshima: "広島県",
	Yamaguchi: "山口県",
	Tokushima: "徳島県",
	Kagawa: "香川県",
	Ehime: "愛媛県",
	Kochi: "高知県",
	Fukuoka: "福岡県",
	Saga: "佐賀県",
	Nagasaki: "長崎県",
	Kumamoto: "熊本県",
	Oita: "大分県",
	Miyazaki: "宮崎県",
	Kagoshima: "鹿児島県",
	Okinawa: "沖縄県"
};

let inputResolve = null;

const init = () => {
	const svg = document.querySelector("svg");
	const groups = svg.getElementsByTagName("g");
	const svgRect = svg.getBoundingClientRect();

	for (const group of groups) {
		if (!group.id || group.id === "Hopporyodo") {
			continue;
		}
		prefIds.push(group.id);

		const input = document.createElement("input");
		input.type = "button";
		input.value = prefNames[group.id];
		input.onclick = () => {
			window.scrollTo(0, 0);
			inputResolve(group.id);
		};
		document.getElementById("inputarea").appendChild(input);

		const rect = group.getBoundingClientRect();
		const top = rect.top - svgRect.top;
		const left = rect.left - svgRect.left;
		const info = { top, left, width: rect.width, height: rect.height, element: group };
		prefInfoMap[group.id] = info;
	}
};

const showPref = (id, angle) => {
	const svg = document.querySelector("svg");
	for (const prefId of prefIds) {
		prefInfoMap[prefId].element.style.opacity = "";
	}

	const { top, left, width, height, element } = prefInfoMap[id];
	element.style.opacity = 1;

	element.parentElement.style.transform = `translate(${-left}px, ${-top}px)`;
	svg.setAttribute("width", `300`);
	svg.setAttribute("height", `300`);
	svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

	svg.classList.remove("show-answer");
	svg.style.transform = `scale(0.7) rotate(${angle}deg)`;
};

const game = async () => {
	const message = document.getElementById("message");
	const svg = document.querySelector("svg");
	while (true) {
		message.textContent = ``;
		let angle;
		do {
			angle = Math.random() * 360 - 180;
		} while (-45 < angle && angle < 45);
		const pref = prefIds[Math.trunc(Math.random() * prefIds.length)];
		showPref(pref, angle);
		const answer = await new Promise((resolve) => {
			inputResolve = resolve;
		});
		if (answer === pref) {
			message.textContent = `正解！`;
		} else {
			message.textContent = `残念！正解は ${prefNames[pref]} でした`;
		}
		svg.classList.add("show-answer");
		await new Promise((r) => setTimeout(r, 4000));
	}
};

window.onload = () => {
	init();
	game();
	document.getElementById("level").onchange = (e) => {
		const level = e.target.value;
		const levels = [...document.getElementsByName("level")].map((x) => x.value);
		document.getElementById("container").classList.remove(...levels);
		document.getElementById("container").classList.add(level);
	};
};
