import * as MRE from '@microsoft/mixed-reality-extension-sdk';
export default class HelloWorld {
	private texto: MRE.Actor = null;
	private BotaoVermelho: MRE.Actor = null;
	private seta: MRE.Actor = null;
	private BotaoAzul: MRE.Actor = null;
	private assets: MRE.AssetContainer;
    

	constructor(private context: MRE.Context) {
		this.context.onStarted(() => this.started());
	}
	private async started() {
		this.assets = new MRE.AssetContainer(this.context);
		const player = 1; let chance = 0;
		const botaoVermelho = await this.assets.loadGltf('Botao_Vermelho.glb', "box");
		const botaoAzul = await this.assets.loadGltf('Botao_Azul.glb', "box");
		const setaAsset = await this.assets.loadGltf('Seta.glb', "box");

		this.texto = MRE.Actor.Create(this.context, {
			actor: {
				name: 'Text',
				transform: {
					app: { position: { x: 0, y: 0.5, z: 0 } }
				},
				text: {
					contents: "Ola!!",
					anchor: MRE.TextAnchorLocation.MiddleCenter,
					color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
					height: 0.3
				}
			}
		});		
		this.BotaoVermelho = MRE.Actor.CreateFromPrefab(this.context, {
			firstPrefabFrom: botaoVermelho,  		
			actor: {
				name: 'botaoADM',
				parentId: this.texto.id,
				transform: {
					local: {
						position: { x: 4, y: 3, z: 0 },
						scale: { x: 0.8, y: 0.8, z: 0.8 }
					}
				}
			}
		});	
		this.BotaoAzul = MRE.Actor.CreateFromPrefab(this.context, {
			firstPrefabFrom: botaoAzul,
			actor: {
				name: 'botao plateia',
				parentId: this.texto.id,
				transform: {
					local: {
						position: { x: 0, y: -1, z: 0 },
						scale: { x: 0.4, y: 0.4, z: 0.4 }
					}
				}
			}
		});		
		const buttonBehavior = this.BotaoAzul.setBehavior(MRE.ButtonBehavior);
		const buttonHost = this.BotaoVermelho.setBehavior(MRE.ButtonBehavior);
		buttonHost.onClick(usuario => {
			this.texto.text.contents = "Valendo!!!!!!";			
			
			this.seta.destroy();
			chance--;
		});
		buttonBehavior.onClick(usuario => {
			if(chance<player){
			   this.seta = MRE.Actor.CreateFromPrefab(this.context, {
				 firstPrefabFrom: setaAsset,
				   actor: {
					 name: 'botaoADM',
					 parentId: this.texto.id,
					 transform: {
						local: {
							position: { x: 0, y: 2, z: 0 },
							scale: { x: 0.8, y: 0.8, z: 0.8 }
						}
					 },
					 attachment: {
						attachPoint: 'spine-middle', 
						userId: usuario.id
						
					 }
				        }
			    });
			this.texto.text.contents = "Direito de resposta para:" + usuario.name;
			chance++;
		   }			
		});
	}
}
