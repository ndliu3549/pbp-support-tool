<template>
	<div id="app">
		<div style="text-align:center;">
			<h2>CPBL PLAY BY PLAY Support Tool</h2>
			<button class="btn btn-primary" type="button" @click="BallSubmitMessage(listdata)">Import LOG data（JSON format）</button>
			<button class="btn btn-primary" type="button" @click="CleanBallSubmitMessage()">Clean data</button>
		</div>
		<ul id="ul">
		</ul>
	</div>
</template>

<script>
	var config = {
		apiKey: "AIzaSyCaWqHus5lbszeGpNqjh9PhgnKbTY_GpaM",
		authDomain: "new-firebase-3065e.firebaseapp.com",
		databaseURL: "https://new-firebase-3065e.firebaseio.com",
		projectId: "new-firebase-3065e",
		storageBucket: "new-firebase-3065e.appspot.com",
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
					list = `${list}<li>第${item.Game}場：${item.Team}：${item.Inning}：${item.Log}</li>
					<input disabled id="input_Player" size="3" value=${item.Player} />
					<input disabled id="input_Base1" size="3" value=${item.Base1} />
					<input disabled id="input_Base2" size="3" value=${item.Base2} />
					<input disabled id="input_Base3" size="3" value=${item.Base3} />
					<input disabled id="input_Id" size="3" value=${item.Id} />
					<input disabled id="input_Direction" size="1" value=${item.Direction} />
					<input disabled id="input_Out" size="3" value=${item.Out} />
					<input disabled id="input_Result" size="16" value=${item.Result} />
					<button type="button" class="enable" data-key="${i}">啟用更正</button>
					<button disabled id="summit_modify" type="button" class="edit"
					data-key="${i}">送出更正</button>`

				});

				$('ul').html(list)
			});

			$('#ul').on('click', '.enable', function() {

				$("#input_Player").attr("disabled", false);
				$("#input_Base1").attr("disabled", false);
				$("#input_Base2").attr("disabled", false);
				$("#input_Base3").attr("disabled", false);
				$("#input_Id").attr("disabled", false);
				$("#input_Direction").attr("disabled", false);
				$("#input_Out").attr("disabled", false);
				$("#input_Result").attr("disabled", false);
				$("#summit_modify").attr("disabled", false);
			});

			$('#ul').on('click', '.edit', function() {

				var update_player = $("#input_Player").val();
				var update_base1 = $("#input_Base1").val();
				var update_base2 = $("#input_Base2").val();
				var update_base3 = $("#input_Base3").val();
				var update_id = $("#input_Id").val();
				var update_direction = $("#input_Direction").val();
				var update_out = $("#input_Out").val();
				var update_result = $("#input_Result").val();
				var key = $(this).data('key');

				BaseballRef.child(key).update({
					"Player": update_player,
					"Base1": update_base1,
					"Base2": update_base2,
					"Base3": update_base3,
					"Id": update_id,
					"Direction": update_direction,
					"Out": update_out,
					"Result": update_result
				});

				$("#input_Player").attr("disabled", true);
				$("#input_Base1").attr("disabled", true);
				$("#input_Base2").attr("disabled", true);
				$("#input_Base3").attr("disabled", true);
				$("#input_Id").attr("disabled", true);
				$("#input_Direction").attr("disabled", true);
				$("#input_Out").attr("disabled", true);
				$("#input_Result").attr("disabled", true);
				$("#summit_modify").attr("disabled", true);
			});
		}
	}
</script>

<style>

</style>