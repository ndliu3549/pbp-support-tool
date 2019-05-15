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
					<downloadExcel :data="exportjson" :fields="json_fields" type="csv" name="pbptool_log.csv">
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
				
				<button type="button" class="btn btn-dark" data-toggle="collapse" data-target="#setDB" @click='setDB()'>
					設定資料庫示範
					<!--set Database-->
				</button>
			</div>

			<div id='readme' class="collapse">
				<h6 id='h6'></h6>
			</div>
			
			<div id='setDB' class="collapse">
				<h5 id='h5'></h5>
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
		apiKey: 'AIzaSyDuscttLRI74uotEQG_al8kKhU8QxKzgDI',
		authDomain: 'new-firebase-8b1fc.firebaseapp.com',
		databaseURL: 'https://new-firebase-8b1fc.firebaseio.com',
		projectId: 'new-firebase-8b1fc',
		storageBucket: 'new-firebase-8b1fc.appspot.com',
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
			setDB () {
				let list = '';
				
				list = `
					<div>
						<center>
						<div style='margin:10px 10px 10px 10px; white-space:pre-line; width:700px; text-align:left;'>
						
							首先，登入 Google 帳號，然後來到網址
							https://console.firebase.google.com/
							創建一個新專案〈如圖一、圖二〉
							
							接下來，進入專案，切換到 Database 頁面〈如圖三〉
							下拉看到 Realtime Database，建立資料庫〈如圖四〉
							勾選〈以測試模式啟動〉〈如圖五〉
							
							建立資料庫後，切換到專案設定頁面〈如圖六〉
							記下〈專案 ID〉以及〈網路 API 金鑰〉〈如圖七〉
							
							打開 pbp-support-tool 資料夾
							找到 src -> components -> pages 資料夾內的兩個檔案
							用記事本或程式編輯工具〈推薦使用 Sublime Text〉
							打開 child.vue 以及 page.vue，找到兩個檔案裡的 config 資料結構
							替換 API Key 跟專案 ID〈如圖八、圖九〉成剛才〈如圖七〉記下的數據
							儲存檔案，重新匯入 Log〈參照匯入 Log 的方法〉即可
						</div>
						</center>
							<br>
						<div>
							〈圖一〉
							<br>
							<img src="/static/setDB_01.png" width="75%" style='border-style: outset'/>
						</div>
							<br>
						<div>
							〈圖二〉
							<br>
							<img src="/static/setDB_02.png" style='border-style: outset'/>
						</div>
							<br>
						<div>
							〈圖三〉
							<br>
							<img src="/static/setDB_03.png" style='border-style: outset'/>
						</div>
							<br>
						<div>
							〈圖四〉
							<br>
							<img src="/static/setDB_04.png" style='border-style: outset'/>
						</div>
							<br>
						<div>
							〈圖五〉
							<br>
							<img src="/static/setDB_05.png" style='border-style: outset'/>
						</div>
							<br>
						<div>
							〈圖六〉
							<br>
							<img src="/static/setDB_06.png" style='border-style: outset'/>
						</div>
							<br>
						<div>
							〈圖七〉
							<br>
							<img src="/static/setDB_07.png" style='border-style: outset'/>
						</div>
							<br>
						<div>
							〈圖八〉
							<br>
							<img src="/static/setDB_08.png" style='border-style: outset'/>
						</div>
							<br>
						<div>
							〈圖九〉
							<br>
							<img src="/static/setDB_09.png" style='border-style: outset'/>
						</div>
					</div>
				`
				
				$('h5').html(list)
			},
			Readme() {
				let list = '';
				
				list = `
					<div>
						<center>
						<div style='margin:10px 10px 10px 10px; white-space:pre-line; width:500px; text-align:left;'>
							【匯入 Log 的方法〈圖一〉】
							一、點擊〈清除資料〉
							二、點擊〈選取匯入檔案〉
							三、點擊〈匯入新 Log〉或〈匯入 pbptool 格式 Log〉
							檔名不限，格式符合要求即可
							
							【編輯 Log 的方法〈圖二〉】
							一、點選場次
							二、點擊〈顯示 Log〉
							三、編輯
							四、完成
							五、點擊〈顯示 Log〉收合
							
							【輸出 Log 的方法〈圖三〉】
							點擊兩次〈匯出 pbptool 格式 Log〉
							在另存新檔視窗跳出的時候，輸入方便記憶的檔名即可
							〈預設檔名 pbptool_log.csv〉
							
							【下載設定另存新檔的方法〈以 chrome 瀏覽器為例〉】
							一、點擊瀏覽器的設定〈如圖四〉
							二、下拉點擊進階選項〈如圖五〉
							三、找到下載前詢問儲存位置的選項，啟用〈如圖六〉
							四、完成
						</div>
						</center>
							<br>
						<div>
							〈圖一〉
							<br>
							<img src="/static/demo_09-1.gif" width="955" height="455" style='border-style: outset'/>
						</div>
							<br>
						<div>
							〈圖二〉
							<br>
							<img src="/static/demo_09-2.gif" width="955" height="455" style='border-style: outset'/>
						</div>
							<br>
						<div>
							〈圖三〉
							<br>
							<img src="/static/demo_09-3.gif" width="955" height="455" style='border-style: outset'/>
						</div>
							<br>
						<div>
							〈圖四〉
							<br>
							<img src="/static/setDL_01.png" style='border-style: outset'/>
						</div>
							<br>
						<div>
							〈圖五〉
							<br>
							<img src="/static/setDL_02.png" style='border-style: outset'/>
						</div>
							<br>
						<div>
							〈圖六〉
							<br>
							<img src="/static/setDL_03.png" style='border-style: outset'/>
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