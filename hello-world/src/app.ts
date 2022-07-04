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
					contents: "Hello World!",
					anchor: MRE.TextAnchorLocation.MiddleCenter,
					color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
					height: 0.3
				}
			}
		});
		const spinAnimData = this.assets.createAnimationData(
			"Spin",
			{
				tracks: [{
					target: MRE.ActorPath("text").transform.local.rotation,
					keyframes: this.generateSpinKeyframes(20, MRE.Vector3.Up()),
					easing: MRE.AnimationEaseCurves.Linear
				}]
			});
		spinAnimData.bind(
			{ text: this.texto },
			{ isPlaying: true, wrapMode: MRE.AnimationWrapMode.PingPong });
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
		
		const flipAnimData = this.assets.createAnimationData(
			"DoAFlip",
			{ tracks: [{
				target: MRE.ActorPath("target").transform.local.rotation,
				keyframes: this.generateSpinKeyframes(1.0, MRE.Vector3.Right()),
				easing: MRE.AnimationEaseCurves.Linear
			}]}
		);
		const flipAnim = await flipAnimData.bind({ target: this.BotaoAzul });
		const buttonBehavior = this.BotaoAzul.setBehavior(MRE.ButtonBehavior);

		buttonBehavior.onHover('enter', () => {
			MRE.Animation.AnimateTo(this.context, this.BotaoAzul, {
				destination: { transform: { local: { scale: { x: 0.5, y: 0.5, z: 0.5 } } } },
				duration: 0.3,
				easing: MRE.AnimationEaseCurves.EaseOutSine
			});
		});
		buttonBehavior.onHover('exit', () => {
			MRE.Animation.AnimateTo(this.context, this.BotaoAzul, {
				destination: { transform: { local: { scale: { x: 0.4, y: 0.4, z: 0.4 } } } },
				duration: 0.3,
				easing: MRE.AnimationEaseCurves.EaseOutSine
			});
		});
		buttonBehavior.onClick(usuario => {

			this.seta = MRE.Actor.CreateFromPrefab(this.context, {
				firstPrefabFrom: setaAsset,
				actor: {
					name: 'botaoADM',
					parentId: this.texto.id,
					transform: {
						local: {
							position: { x: 4, y: 3, z: 0 },
							scale: { x: 0.8, y: 0.8, z: 0.8 }
						}
					},
					attachment: {
						attachPoint: 'head', 
						userId: usuario.id
						
					}
				}
			});
			
			this.texto.text.contents = "Direito de resposta para:" + usuario.name;
			flipAnim.play();
		});
	}
	private generateSpinKeyframes(duration: number, axis: MRE.Vector3): Array<MRE.Keyframe<MRE.Quaternion>> {
		return [{
			time: 0 * duration,
			value: MRE.Quaternion.RotationAxis(axis, 0)
		}, {
			time: 0.25 * duration,
			value: MRE.Quaternion.RotationAxis(axis, Math.PI / 2)
		}, {
			time: 0.5 * duration,
			value: MRE.Quaternion.RotationAxis(axis, Math.PI)
		}, {
			time: 0.75 * duration,
			value: MRE.Quaternion.RotationAxis(axis, 3 * Math.PI / 2)
		}, {
			time: 1 * duration,
			value: MRE.Quaternion.RotationAxis(axis, 2 * Math.PI)
		}];
	}
}
