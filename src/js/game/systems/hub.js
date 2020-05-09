import { GameSystemWithFilter } from "../game_system_with_filter";
import { HubComponent } from "../components/hub";
import { DrawParameters } from "../../core/draw_parameters";
import { Entity } from "../entity";
import { formatBigNumber } from "../../core/utils";

export class HubSystem extends GameSystemWithFilter {
    constructor(root) {
        super(root, [HubComponent]);
    }

    draw(parameters) {
        this.forEachMatchingEntityOnScreen(parameters, this.drawEntity.bind(this));
    }

    update() {
        for (let i = 0; i < this.allEntities.length; ++i) {
            const entity = this.allEntities[i];

            const hubComponent = entity.components.Hub;

            const queue = hubComponent.definitionsToAnalyze;
            for (let k = 0; k < queue.length; ++k) {
                const definition = queue[k];
                this.root.hubGoals.handleDefinitionDelivered(definition);
            }

            hubComponent.definitionsToAnalyze = [];
        }
    }

    /**
     * @param {DrawParameters} parameters
     * @param {Entity} entity
     */
    drawEntity(parameters, entity) {
        const context = parameters.context;
        const staticComp = entity.components.StaticMapEntity;

        const pos = staticComp.getTileSpaceBounds().getCenter().toWorldSpace();

        const definition = this.root.hubGoals.currentGoal.definition;

        definition.draw(pos.x - 25, pos.y - 10, parameters, 40);

        const goals = this.root.hubGoals.currentGoal;

        const textOffsetX = 2;
        const textOffsetY = -6;

        // Deliver count
        context.font = "bold 25px GameFont";
        context.fillStyle = "#64666e";
        context.textAlign = "left";
        context.fillText(
            "" + formatBigNumber(this.root.hubGoals.getCurrentGoalDelivered()),
            pos.x + textOffsetX,
            pos.y + textOffsetY
        );

        // Required
        context.font = "13px GameFont";
        context.fillStyle = "#a4a6b0";
        context.fillText(
            "/ " + formatBigNumber(goals.required),
            pos.x + textOffsetX,
            pos.y + textOffsetY + 13
        );

        // Reward
        context.font = "bold 11px GameFont";
        context.fillStyle = "#fd0752";
        context.textAlign = "center";
        context.fillText(goals.reward.toUpperCase(), pos.x, pos.y + 46);

        // Level
        context.font = "bold 11px GameFont";
        context.fillStyle = "#fff";
        context.fillText("" + this.root.hubGoals.level, pos.x - 42, pos.y - 36);

        context.textAlign = "left";
    }
}