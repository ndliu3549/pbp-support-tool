<template>
	<div id='app'>
		<div style='text-align:center;'>
			<h2>CPBL PLAY BY PLAY Support Tool</h2>
			<button class='btn btn-light' type='button' @click='BallSubmitMessage(listdata)'>
				Import LOG data（JSON format）
			</button>
			<button class='btn btn-light' type='button' @click='CleanBallSubmitMessage()'>
				Clean data
			</button>
		</div>
		<div>
			<router-view></router-view>
			<div class="container demo">
				<ul id='ul'>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	var config = {
		apiKey: 'AIzaSyCaWqHus5lbszeGpNqjh9PhgnKbTY_GpaM',
		authDomain: 'new-firebase-3065e.firebaseapp.com',
		databaseURL: 'https://new-firebase-3065e.firebaseio.com',
		projectId: 'new-firebase-3065e',
		storageBucket: 'new-firebase-3065e.appspot.com',
	};
	firebase.initializeApp(config);

	var BaseballRef = firebase.database().ref('Baseball');
	var idArray = Array();

	export default {
		name: 'App',
		data() {
			return {
				listdata: [],
				isShow: false
			}
		},
		methods: {
			CleanBallSubmitMessage() {
				BaseballRef.remove();
			},
			BallSubmitMessage(listdata) {
				let away = '';
				let home = '';
				let firstPart = '';
				let secondPart = '';
				let thirdPart = '';

				for(var i = 0; i < listdata.length; i++) {

					if(listdata[i].Player != '') {

						if(firstPart != listdata[i].numforgame)
							if(listdata[i].numforgame != '') firstPart = listdata[i].numforgame;

						if(away != listdata[i].away.slice(0, 2) ||
							home != listdata[i].home.substr(-2, 2)) {
							away = listdata[i].away.slice(0, 2);
							home = listdata[i].home.substr(-2, 2);
							secondPart = away + 'VS' + home;
						}

						if(thirdPart != listdata[i].inning) thirdPart = listdata[i].inning;

						BaseballRef.push({
							Game: firstPart,
							Team: secondPart,
							Inning: thirdPart,
							Log: listdata[i].log,
							Player: listdata[i].Player,
							Base1: listdata[i].base1,
							Base2: listdata[i].base2,
							Base3: listdata[i].base3,
							Id: listdata[i].id,
							Direction: listdata[i].direction,
							Out: listdata[i].out,
							Result: listdata[i].result
						})
					}
				}
			},
			getData() {
				let vm = this

				vm.axios.get('static/data.json')
					.then(function(response) {
						console.log(response);
						vm.listdata = response.data
					})
					.catch(function(error) {
						console.log(error);
					});
			}
		},
		mounted() {
			this.getData();
			BaseballRef.on('value', function(snapshot) {
				let val = snapshot.val();
				let list = '';
				let inning = '';
				let arrayHeader = '';

				list = `
					<div class="row">
				`

				$.each(val, function(i, item) {

					if(inning != item.Inning) {

						list = `
							${list}
							<div class="col-3">
								<a href="#/child/${i}" style='margin:5px;'
									class="router-link-exact-active router-link-active btn btn-secondary">
										第${item.Game}場：${item.Team}：${item.Inning}
								</a>
							</div>
						`

						inning = item.Inning

						arrayHeader = i;

						idArray[arrayHeader] = Array();
					}

					list = `
						${list}
					`

					idArray[arrayHeader].push(i);
				});

				list = `
					${list}
					</div>
				`
				$('ul').html(list)
			});
		}
	}
</script>

<style>

</style>