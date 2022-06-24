export default function sceneRenderMixin(playersVar, localPlayerVar, babylonVar, eventDispacherVar) {
    const players = eval(playersVar);
    const localPlayer = eval(localPlayerVar);
    const BABYLON = eval(babylonVar);
    const eventDispacher = eval(eventDispacherVar);

    const enemySphereMaterial = new BABYLON.StandardMaterial(
        "enemySphereMaterial",
        localPlayer.actor.scene
    );
    enemySphereMaterial.emissiveColor = enemySphereMaterial.diffuseColor =
        new BABYLON.Color3(1, 0, 0);
    enemySphereMaterial.wireframe = true;
    window.shellHack.enemySphereMaterial = enemySphereMaterial;

    const allySphereMaterial = new BABYLON.StandardMaterial(
        "allySphereMaterial",
        localPlayer.actor.scene
    );
    allySphereMaterial.emissiveColor = allySphereMaterial.diffuseColor =
        new BABYLON.Color3(0, 0, 1);
    allySphereMaterial.wireframe = true;
    window.shellHack.allySphereMaterial = allySphereMaterial;

    if (!localPlayer) return;

    if (!window.shellHack.rayOrigin) {
        window.shellHack.rayOrigin = new BABYLON.Vector3();
    }

    window.shellHack.rayOrigin.copyFrom(localPlayer.actor.mesh.position);

    const localYaw = localPlayer.actor.mesh.rotation.y;
    window.shellHack.rayOrigin.x += Math.sin(localYaw);
    window.shellHack.rayOrigin.z += Math.cos(localYaw);
    window.shellHack.rayOrigin.y += Math.sin(-localPlayer.pitch);

    for (let i = 0; i < window.shellHack.rays.length; i++) {
        window.shellHack.rays[i].shouldDispose = true;
    }

    for (let i = 0; i < players.length; i++) {
        const player = players[i];

        if (!player || player == localPlayer) continue;

        if (player.sphere == null) {
            const sphere = BABYLON.MeshBuilder.CreateBox(
                "playerSphere",
                { width: 0.5, height: 0.75, depth: 0.5 },
                player.actor.scene
            );
            sphere.material =
                localPlayer.team === 0 || localPlayer.team !== player.team
                    ? window.shellHack.enemySphereMaterial
                    : window.shellHack.allySphereMaterial;
            sphere.position.y = 0.3;

            sphere.parent = player.actor.mesh;
            player.sphere = sphere;
        }
        if (player.ray == null) {
            const options = {
                points: [
                    localPlayer.actor.mesh.position,
                    player.actor.mesh.position,
                ],
                updatable: true,
            };

            const ray = (options.instance = BABYLON.MeshBuilder.CreateLines(
                "ray",
                options,
                player.actor.scene
            ));
            ray.color = new BABYLON.Color3(1, 0, 0);
            ray.alwaysRenderAsActiveMesh = true;
            ray.renderingGroupId = 1;

            player.ray = ray;
            player.rayOptions = options;

            window.shellHack.rays.push(ray);
        }

        player.ray.shouldDispose = false;
        player.ray = BABYLON.MeshBuilder.CreateLines(
            "lines",
            player.rayOptions
        );

        player.sphere.material =
            localPlayer.team === 0 || localPlayer.team !== player.team
                ? window.shellHack.enemySphereMaterial
                : window.shellHack.allySphereMaterial;
        player.sphere.renderingGroupId = window.shellHack.config.espEnabled
            ? 1
            : 0;
        player.sphere.visibility =
            window.shellHack.config.espEnabled && localPlayer !== player;

        player.ray.visibility = window.shellHack.config.esp.raysEnabled && localPlayer.playing && player.playing && (localPlayer.team === 0 || localPlayer.team !== player.team);
    }

    for (let i = 0; i < window.shellHack.rays.length; i++) {
        const ray = window.shellHack.rays[i];

        if (ray.shouldDispose) {
            ray.dispose();
            window.shellHack.rays.splice(i, 1);
        }
    }
}
