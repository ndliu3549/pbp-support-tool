<template>
	<div id='app'>
		<div style='text-align:center;'>
			<h2>CPBL PLAY BY PLAY Support Tool</h2>

			<div>
				<button class='btn btn-light' type='button' @click='NewImport(ImportData)'>
					匯入新 Log
					<!--Import New LOG-->
				</button>

				<label for="files" class="custom-file-upload">
    				<i class="fa fa-cloud-upload"></i> 選取匯入檔案（CSV 格式）
    				<!--Select File（CSV）-->
				</label>

				<input id="files" type="file" name="files[]" multiple/>

				<button class='btn btn-light' type='button' @click='OldImport(ImportData)'>
					匯入 pbptool 格式 Log
					<!--Import Old LOG-->
				</button>
			</div>

			<div>
				<a class='btn btn-light' href="http://localhost:8080/">回首頁</a>
				<!--Refresh Page-->

				<button class='btn btn-light' type='button' @click="getExportJSON">
					<downloadExcel :data="exportjson" :fields="json_fields" type="csv" name="Old LOG.csv">
						匯出 pbptool 格式 Log（雙擊）
						<!--Export Old LOG（Double Click）-->
					</downloadExcel>
				</button>

				<button class='btn btn-light' type='button' @click='CleanData()'>
					清除資料（需重新匯入）
					<!--Clean Data-->
				</button>
				
				<button type="button" class="btn btn-dark" data-toggle="collapse" data-target="#readme" @click='Readme()'>
					操作示範
					<!--Readme-->
				</button>
			</div>

			<div id='readme' class="collapse">
				<h6 id='h6'></h6>
			</div>

		</div>

		<div>
			<router-view></router-view>
			<div>
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
				ImportData: [],
				isShow: false,
				exportjson: [],
				json_fields: {
					'base1': 'base1',
					'base2': 'base2',
					'base3': 'base3',
					'direction': 'direction',
					'game': 'game',
					'id': 'id',
					'inning': 'inning',
					'log': 'log',
					'out': 'out',
					'Player': 'Player',
					'result': 'result',
					'team': 'team'
				},
			}
		},
		methods: {
			Readme() {
				let list = '';
				
				list = `
					<div>
						<center>
						<div style='margin:10px 10px 10px 10px; white-space:pre-line; width:500px; text-align:left;'>
							【匯入 Log 的方法】
							一、點擊〈選取匯入檔案〉
							二、點擊〈匯入新 Log〉或〈匯入 pbptool 格式 Log〉
							
							【編輯 Log 的方法】
							一、點選場次
							二、點擊〈顯示 Log〉
							三、編輯
							四、完成
							五、點擊〈顯示 Log〉收合
							
							【輸出 Log 的方法】
							點擊兩次〈匯出 pbptool 格式 Log〉即可
							
						</div>
						</center>
						
						<div>
							<img src="/static/demo_07.gif" width="955" height="455" style='border-style: outset'/>
						</div>
					</div>
				`
				
				$('h6').html(list)
			},
			getExportJSON() {
				let vm = this;
				BaseballRef.on('value', function(snapshot) {
					let val = snapshot.val();
					$.each(val, function(i, item) {
						vm.exportjson.push(item);
					});
				});
			},
			CleanData() {
				BaseballRef.remove();
			},
			OldImport(ImportData) {
				for(var i = 0; i < ImportData.length; i++) {
					BaseballRef.push({
						game: ImportData[i].game,
						team: ImportData[i].team,
						inning: ImportData[i].inning,
						log: ImportData[i].log,
						Player: ImportData[i].Player,
						base1: ImportData[i].base1,
						base2: ImportData[i].base2,
						base3: ImportData[i].base3,
						id: ImportData[i].id,
						direction: ImportData[i].direction,
						out: ImportData[i].out,
						result: ImportData[i].result
					})
				}
			},
			NewImport(ImportData) {
				let away = '';
				let home = '';
				let firstPart = '';
				let secondPart = '';
				let thirdPart = '';

				for(var i = 0; i < ImportData.length; i++) {

					if(ImportData[i].Player != '') {

						if(firstPart != ImportData[i].numforgame)
							if(ImportData[i].numforgame != '') firstPart = ImportData[i].numforgame;

						secondPart = ImportData[i].away + ' VS ' + ImportData[i].home

						if(thirdPart != ImportData[i].inning) thirdPart = ImportData[i].inning;

						BaseballRef.push({
							game: firstPart,
							team: secondPart,
							inning: thirdPart,
							log: ImportData[i].log,
							Player: ImportData[i].Player,
							base1: ImportData[i].base1,
							base2: ImportData[i].base2,
							base3: ImportData[i].base3,
							id: ImportData[i].id,
							direction: ImportData[i].direction,
							out: ImportData[i].out,
							result: ImportData[i].result
						})
					}
				}
			},
			getImport() {

				let vm = this

				$(document).ready(function() {
					$('#files').bind('change', handleFileSelect);
				});

				function handleFileSelect(evt) {
					var files = evt.target.files;
					var file = files[0];

					printTable(file);
				}

				function printTable(file) {
					var reader = new FileReader();
					reader.readAsText(file);
					reader.onload = function(event) {
						var csv = event.target.result;
						vm.ImportData = $.csv.toObjects(csv);
					};
				}
			}
		},
		mounted() {

			this.getImport();

			BaseballRef.on('value', function(snapshot) {
				let val = snapshot.val();
				let list = '';
				let inning = '';
				let arrayHeader = '';
				let itemGame = '';

				list = `
					<div>
				`

				$.each(val, function(i, item) {

					if(itemGame != item.game) {
						itemGame = item.game;

						list = `
							${list}
							</div>
							<div style='margin:5px 5px 5px 5px'>
								<button type="button" class="btn btn-secondary" data-toggle="collapse" data-target="#clapsme${itemGame}">
									第 ${itemGame} 場
								</button>
							</div>
							<div id='clapsme${itemGame}' class="collapse">
						`
					}

					if(inning != item.inning) {

						list = `
							${list}
							<a id="${i}" href="#/child/${i}" style='margin:5px 5px 5px 5px'
								class="router-link-exact-active router-link-active btn btn-secondary ">
									第${item.game}場：${item.team}：${item.inning}
							</a>
						`

						inning = item.inning

						arrayHeader = i;

						idArray[arrayHeader] = Array();
					}

					idArray[arrayHeader].push(i);
				});

				$('ul').html(list)
			});
		}
	}
</script>

<style>
	pre {
		outline: 1px solid #ccc;
		padding: 5px;
		margin: 5px 5px 5px 5px;
	}
	
	.string {
		color: green;
	}
	
	.number {
		color: darkorange;
	}
	
	.boolean {
		color: blue;
	}
	
	.null {
		color: magenta;
	}
	
	.key {
		color: red;
	}
	
	input[type="file"] {
		display: none;
	}
	
	.custom-file-upload {
		border: 1px solid #ccc;
		display: inline-block;
		padding: 6px 12px;
		cursor: pointer;
	}
</style>