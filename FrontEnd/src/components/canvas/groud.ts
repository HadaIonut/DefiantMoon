import * as THREE from 'three'
import {usePlayAreaStore} from 'src/stores/PlayArea'
import {Scene} from 'three'

export const initGround = (canvas: Scene) => {
  const playAreaStore = usePlayAreaStore()

  const groundTexture = new THREE.TextureLoader().load('./map.jpg')
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(playAreaStore.groundDimension, playAreaStore.groundDimension),
    new THREE.MeshStandardMaterial({
      map: groundTexture,
      color: 0xffffff,
      depthWrite: true,
    }))
  ground.rotateX(-Math.PI / 2)
  ground.receiveShadow = true

  canvas.add(ground)

  let gridHelper = new THREE.GridHelper(playAreaStore.groundDimension, playAreaStore.gridSize)
  gridHelper.position.y += 5
  canvas.add(gridHelper)

  playAreaStore.$subscribe(({events}) => {
    const parsedEvents = Array.isArray(events) ? events : [events]
    parsedEvents.forEach((event) => {
      if (event.type === 'set' && event.key === 'groundDimension') {
        ground.geometry = new THREE.PlaneGeometry(playAreaStore.groundDimension, playAreaStore.groundDimension)
        gridHelper.removeFromParent()

        gridHelper = new THREE.GridHelper(playAreaStore.groundDimension, playAreaStore.gridSize)
        gridHelper.position.y += 5
        canvas.add(gridHelper)
      } else if (event.type === 'set' && event.key === 'gridSize') {
        gridHelper.removeFromParent()

        gridHelper = new THREE.GridHelper(playAreaStore.groundDimension, playAreaStore.gridSize)
        gridHelper.position.y += 5
        canvas.add(gridHelper)
      }
    })
  })
}
