import type { IConflict } from "@/interfaces/IConflict";
import conflictService from "@/services/conflictService";
import rulesService from "@/services/rulesService";
import { defineStore } from "pinia"
import { ref } from "vue";

export const useConflictStore = defineStore('conflictStore', () => {
    const conflictData = ref<IConflict[]>([]);
    const countExpand = ref(2);
    const fetchConflictData = async () => {
        const response = await conflictService.getConflict({
          status: "active"
        });

        let result = []

        for (let i = 0; i < response.length; i++) {
          let rule_ids = response[i].rule_ids
          let rules = []
          for (let j = 0; j < rule_ids.length; j++) {
            let rule = await rulesService.getById(rule_ids[j])
            rules.push(rule)
          }
          response[i].rules = rules
          response[i].countExpand = 3
          result.push(response[i])
        }  
        return result;
      };
    const setUdsGroupData = async () => {
        const data:any = await fetchConflictData();
        data.forEach((element:any) => {
          const ruleNameLengths = element.rules.slice(0, element.rules.length);
          let rules = ruleNameLengths.map((x:any) => x.rule_name.length)
          const totalLength = rules.reduce((sum:any, length:any) => sum + length, 0);
          if(element.rules.length > 5){
            element.countExpand = 3
          }else{
            if(element.rules.length == 5){
              if(totalLength < 40){
                element.countExpand = 6
              }
            }else if(element.rules.length == 4){
                if(totalLength < 40){
                  element.countExpand = 5
                }
            }else if(element.rules.length == 3){
              if(totalLength < 40){
                element.countExpand = 4
              }
            }else {
              element.countExpand = 3
            }
          }
        });
        conflictData.value = data;
    }
    const putConflictData = async (idRegister:number,resolutionRegister:string) => {
      const response = await conflictService.putConflict({
        conflict_id:idRegister,
        resolution:resolutionRegister
      })
      return response
    }
    return{
        setUdsGroupData,
        conflictData,
        putConflictData,
        countExpand
    }
})