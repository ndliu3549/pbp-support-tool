<template>
	<div>
		<div style='margin:5px 5px 5px 5px; text-align:center'>
			<button type="button" class="btn btn-info" data-toggle="collapse" data-target="#claps" @click='getLog()'>
				顯示 Log
				<!--Display Log-->
			</button>
		</div>
		<div id='claps' class="collapse">
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
	var modifiedArray = Array();
	export default {
		methods: {
			getLog() {
				BaseballRef.on('value', function(snapshot) {
					let val = snapshot.val();
					let inning = '';
					let arrayHeader = '';

					$.each(val, function(i, item) {

						if(inning != item.inning) {

							inning = item.inning

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
						<div style='margin:5px 5px 5px 5px; text-align:center' class="col">
							<pre style='font-weight:bold'>${val.log}</pre>
							<input disabled id='input_Player${ID}' style='text-align:center; width:70px' value=${val.Player} />
							<input disabled id='input_base1${ID}' style='text-align:center; width:70px' value=${val.base1} />
							<input disabled id='input_base2${ID}' style='text-align:center; width:70px' value=${val.base2} />
							<input disabled id='input_base3${ID}' style='text-align:center; width:70px' value=${val.base3} />
							<input disabled id='input_id${ID}' style='text-align:center; width:70px' value=${val.id} />
							<input disabled id='input_direction${ID}' style='text-align:center; width:40px' value=${val.direction} />
							<input disabled id='input_out${ID}' style='text-align:center; width:70px' value=${val.out} />
							<input disabled id='input_result${ID}' style='text-align:center; width:320px' value=${val.result} />
						</div>
					`
					});
				}

				list = `
					${list}
					<div style='margin:10px 10px 10px 10px; text-align:center' class="col">
						<button id='enable_modify${groupID}'
							type='button' class='enable btn btn-light' data-key=${groupID}>編輯</button>
							<!--Enable-->
						<button disabled id='summit_modify${groupID}'
							type='button' class='summit btn btn-light' data-key=${groupID}>完成</button>
							<!--Commit-->
					</div>
				`

				$('p').html(list)

				$('#p').on('click', '.enable', function() {

					var key = $(this).data('key');

					for(var index in idArray[key]) {

						$('#input_Player' + idArray[key][index]).attr('disabled', false);
						$('#input_base1' + idArray[key][index]).attr('disabled', false);
						$('#input_base2' + idArray[key][index]).attr('disabled', false);
						$('#input_base3' + idArray[key][index]).attr('disabled', false);
						$('#input_id' + idArray[key][index]).attr('disabled', false);
						$('#input_direction' + idArray[key][index]).attr('disabled', false);
						$('#input_out' + idArray[key][index]).attr('disabled', false);
						$('#input_result' + idArray[key][index]).attr('disabled', false);
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
						dataArray[index][1] = $('#input_base1' + idArray[key][index]).val()
						dataArray[index][2] = $('#input_base2' + idArray[key][index]).val()
						dataArray[index][3] = $('#input_base3' + idArray[key][index]).val()
						dataArray[index][4] = $('#input_id' + idArray[key][index]).val()
						dataArray[index][5] = $('#input_direction' + idArray[key][index]).val()
						dataArray[index][6] = $('#input_out' + idArray[key][index]).val()
						dataArray[index][7] = $('#input_result' + idArray[key][index]).val()
					}

					for(var index in idArray[key]) {

						BaseballRef.child(idArray[key][index]).update({
							'Player': dataArray[index][0],
							'base1': dataArray[index][1],
							'base2': dataArray[index][2],
							'base3': dataArray[index][3],
							'id': dataArray[index][4],
							'direction': dataArray[index][5],
							'out': dataArray[index][6],
							'result': dataArray[index][7]
						});

						$('#input_Player' + idArray[key][index]).attr('disabled', true);
						$('#input_base1' + idArray[key][index]).attr('disabled', true);
						$('#input_base2' + idArray[key][index]).attr('disabled', true);
						$('#input_base3' + idArray[key][index]).attr('disabled', true);
						$('#input_id' + idArray[key][index]).attr('disabled', true);
						$('#input_direction' + idArray[key][index]).attr('disabled', true);
						$('#input_out' + idArray[key][index]).attr('disabled', true);
						$('#input_result' + idArray[key][index]).attr('disabled', true);
						$('#summit_modify' + idArray[key][index]).attr('disabled', true);

						$('#enable_modify' + idArray[key][index]).attr('disabled', false);
					}
					
					modifiedArray.push(key);
					
					var length = modifiedArray.length;
					
					for (var i=0; i < length; i++) {
						$("#"+modifiedArray[i]).css("background-color", "#8064A1")
					}
				});

			}
		}
	};
</script>

<style>
</style>