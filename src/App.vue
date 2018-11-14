<template>
	<div id='app'>

		<div style='text-align:center;'>
			<h2>CPBL PLAY BY PLAY Support Tool</h2>
			<button class='btn btn-primary' type='button' @click='BallSubmitMessage(listdata)'>Import LOG data（JSON format）</button>
			<button class='btn btn-primary' type='button' @click='CleanBallSubmitMessage()'>Clean data</button>
		</div>

		<div class="container demo">
			<ul id='ul'>
			</ul>
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
				let groupGate = false;
				let arrayHeader = '';

				$.each(val, function(i, item) {

					if((inning != item.Inning) && (groupGate == true)) {

						list = `
						
						${list}
						
							</div>
						
						</div>
						
						`
					}

					if(inning != item.Inning) {

						list = `
						
						${list}
						
						<div class="row">
						
							<button type="button" class="btn btn-primary" data-toggle="collapse" data-target="#${i}">
								第${item.Game}場：${item.Team}：${item.Inning}
							</button>
							
							<button id='enable_modify${i}' type='button' class='enable' data-key=${i}>啟用更正</button>
							<button disabled id='summit_modify${i}' type='button' class='summit' data-key=${i}>送出更正</button>
							
							<div id="${i}" class="collapse in">
						`

						inning = item.Inning

						groupGate = true;

						arrayHeader = i;

						idArray[arrayHeader] = Array();
					}

					list = `
					
					${list}
					
					<div class="col">
					
						<li>${item.Log}</li>
						<input disabled id='input_Player${i}' size='3' value=${item.Player} />
						<input disabled id='input_Base1${i}' size='3' value=${item.Base1} />
						<input disabled id='input_Base2${i}' size='3' value=${item.Base2} />
						<input disabled id='input_Base3${i}' size='3' value=${item.Base3} />
						<input disabled id='input_Id${i}' size='3' value=${item.Id} />
						<input disabled id='input_Direction${i}' size='1' value=${item.Direction} />
						<input disabled id='input_Out${i}' size='3' value=${item.Out} />
						<input disabled id='input_Result${i}' size='16' value=${item.Result} />
					
					</div>
					
					`

					idArray[arrayHeader].push(i);
				});

				$('ul').html(list)
			});

			$('#ul').on('click', '.enable', function() {
				var key = $(this).data('key');

				for(var index in idArray[key]) {

					$('#input_Player' + idArray[key][index]).attr('disabled', false);
					$('#input_Base1' + idArray[key][index]).attr('disabled', false);
					$('#input_Base2' + idArray[key][index]).attr('disabled', false);
					$('#input_Base3' + idArray[key][index]).attr('disabled', false);
					$('#input_Id' + idArray[key][index]).attr('disabled', false);
					$('#input_Direction' + idArray[key][index]).attr('disabled', false);
					$('#input_Out' + idArray[key][index]).attr('disabled', false);
					$('#input_Result' + idArray[key][index]).attr('disabled', false);
					$('#summit_modify' + idArray[key][index]).attr('disabled', false);

					$('#enable_modify' + idArray[key][index]).attr('disabled', true);
				}
			});

			$('#ul').on('click', '.summit', function() {
				var key = $(this).data('key');
				var dataArray = Array();

				for(var index in idArray[key]) {
					
					dataArray[index] = Array();
					dataArray[index][0] = $('#input_Player' + idArray[key][index]).val()
					dataArray[index][1] = $('#input_Base1' + idArray[key][index]).val()
					dataArray[index][2] = $('#input_Base2' + idArray[key][index]).val()
					dataArray[index][3] = $('#input_Base3' + idArray[key][index]).val()
					dataArray[index][4] = $('#input_Id' + idArray[key][index]).val()
					dataArray[index][5] = $('#input_Direction' + idArray[key][index]).val()
					dataArray[index][6] = $('#input_Out' + idArray[key][index]).val()
					dataArray[index][7] = $('#input_Result' + idArray[key][index]).val()
				}

				for(var index in idArray[key]) {

					BaseballRef.child(idArray[key][index]).update({
						'Player': dataArray[index][0],
						'Base1': dataArray[index][1],
						'Base2': dataArray[index][2],
						'Base3': dataArray[index][3],
						'Id': dataArray[index][4],
						'Direction': dataArray[index][5],
						'Out': dataArray[index][6],
						'Result': dataArray[index][7]
					});

					$('#input_Player' + idArray[key][index]).attr('disabled', true);
					$('#input_Base1' + idArray[key][index]).attr('disabled', true);
					$('#input_Base2' + idArray[key][index]).attr('disabled', true);
					$('#input_Base3' + idArray[key][index]).attr('disabled', true);
					$('#input_Id' + idArray[key][index]).attr('disabled', true);
					$('#input_Direction' + idArray[key][index]).attr('disabled', true);
					$('#input_Out' + idArray[key][index]).attr('disabled', true);
					$('#input_Result' + idArray[key][index]).attr('disabled', true);
					$('#summit_modify' + idArray[key][index]).attr('disabled', true);

					$('#enable_modify' + idArray[key][index]).attr('disabled', false);
				}
			});
		}
	}
</script>

<style>
	.container.demo .row {
		padding: 5px;
	}
	
	.container.demo .col {
		padding: 5px;
		margin-left: 25px;
	}
</style>