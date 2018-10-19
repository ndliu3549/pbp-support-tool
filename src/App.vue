<template>
	<div id='app'>
		<div style='text-align:center;'>
			<h2>CPBL PLAY BY PLAY Support Tool</h2>
			<button class='btn btn-primary' type='button' @click='BallSubmitMessage(listdata)'>Import LOG data（JSON format）</button>
			<button class='btn btn-primary' type='button' @click='CleanBallSubmitMessage()'>Clean data</button>
		</div>
		<ul id='ul'>
		</ul>
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

	export default {
		name: 'App',
		data() {
			return {
				listdata: []
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

				$.each(val, function(i, item) {
					
					list = `
					
					${list}
					
					<li>第${item.Game}場：${item.Team}：${item.Inning}：${item.Log}</li>
					
					<input disabled id='input_Player${i}' size='3' value=${item.Player} />
					<input disabled id='input_Base1${i}' size='3' value=${item.Base1} />
					<input disabled id='input_Base2${i}' size='3' value=${item.Base2} />
					<input disabled id='input_Base3${i}' size='3' value=${item.Base3} />
					<input disabled id='input_Id${i}' size='3' value=${item.Id} />
					<input disabled id='input_Direction${i}' size='1' value=${item.Direction} />
					<input disabled id='input_Out${i}' size='3' value=${item.Out} />
					<input disabled id='input_Result${i}' size='16' value=${item.Result} />
					
					<button id='enable_modify${i}' type='button' class='enable' data-key=${i}>啟用更正</button>
					<button disabled id='summit_modify${i}' type='button' class='summit' data-key=${i}>送出更正</button>
					
					`
				});

				$('ul').html(list)
			});

			$('#ul').on('click', '.enable', function() {

				var key = $(this).data('key');

				$('#input_Player' + key).attr('disabled', false);
				$('#input_Base1' + key).attr('disabled', false);
				$('#input_Base2' + key).attr('disabled', false);
				$('#input_Base3' + key).attr('disabled', false);
				$('#input_Id' + key).attr('disabled', false);
				$('#input_Direction' + key).attr('disabled', false);
				$('#input_Out' + key).attr('disabled', false);
				$('#input_Result' + key).attr('disabled', false);
				$('#summit_modify' + key).attr('disabled', false);
				
				$('#enable_modify' + key).attr('disabled', true);
			});

			$('#ul').on('click', '.summit', function() {

				var key = $(this).data('key');

				BaseballRef.child(key).update({
					'Player': $('#input_Player' + key).val(),
					'Base1': $('#input_Base1' + key).val(),
					'Base2': $('#input_Base2' + key).val(),
					'Base3': $('#input_Base3' + key).val(),
					'Id': $('#input_Id' + key).val(),
					'Direction': $('#input_Direction' + key).val(),
					'Out': $('#input_Out' + key).val(),
					'Result': $('#input_Result' + key).val()
				});

				$('#input_Player' + key).attr('disabled', true);
				$('#input_Base1' + key).attr('disabled', true);
				$('#input_Base2' + key).attr('disabled', true);
				$('#input_Base3' + key).attr('disabled', true);
				$('#input_Id' + key).attr('disabled', true);
				$('#input_Direction' + key).attr('disabled', true);
				$('#input_Out' + key).attr('disabled', true);
				$('#input_Result' + key).attr('disabled', true);
				$('#summit_modify' + key).attr('disabled', true);
				
				$('#enable_modify' + key).attr('disabled', false);
			});
		}
	}
</script>

<style>

</style>