<template>
	<div>
		<div style='text-align:center;margin:10px;'>
			<button type="button" class="btn btn-info" data-toggle="collapse" data-target="#claps" @click='getLog()'>
				顯示 Log
			</button>
		</div>
		<div id='claps' class="collapse in">
			<p id='p'></p>
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
	var BaseballRef = firebase.database().ref('Baseball');
	var idArray = Array();
	export default {
		methods: {
			getLog() {
				BaseballRef.on('value', function(snapshot) {
					let val = snapshot.val();
					let inning = '';
					let arrayHeader = '';

					$.each(val, function(i, item) {

						if(inning != item.Inning) {

							inning = item.Inning

							arrayHeader = i;

							idArray[arrayHeader] = Array();
						}

						idArray[arrayHeader].push(i);
					});

				});

				let list = '';

				var groupID = this.$route.params.id;

				for(var index in idArray[this.$route.params.id]) {

					var ID = idArray[this.$route.params.id][index];

					firebase.database().ref('/Baseball/' + ID).on('value', function(snapshot) {

						let val = snapshot.val();

						list = `
						${list}
						<div style='margin:5px;text-align:center;' class="col">
							<li>${val.Log}</li>
							<input disabled id='input_Player${ID}' size='3' value=${val.Player} />
							<input disabled id='input_Base1${ID}' size='3' value=${val.Base1} />
							<input disabled id='input_Base2${ID}' size='3' value=${val.Base2} />
							<input disabled id='input_Base3${ID}' size='3' value=${val.Base3} />
							<input disabled id='input_Id${ID}' size='3' value=${val.Id} />
							<input disabled id='input_Direction${ID}' size='1' value=${val.Direction} />
							<input disabled id='input_Out${ID}' size='3' value=${val.Out} />
							<input disabled id='input_Result${ID}' size='16' value=${val.Result} />
						</div>
					`
					});
				}

				list = `
					${list}
					<div style='margin:10px;text-align:center;' class="col">
						<button id='enable_modify${groupID}'
							type='button' class='enable btn btn-light' data-key=${groupID}>啟用更正</button>
						<button disabled id='summit_modify${groupID}'
							type='button' class='summit btn btn-light' data-key=${groupID}>送出更正</button>
					</div>
				`

				$('p').html(list)

				$('#p').on('click', '.enable', function() {

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

				$('#p').on('click', '.summit', function() {

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
			},
		}
	};
</script>

<style>

</style>