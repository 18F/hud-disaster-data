cat "REAC Modified Database.json"  | \
sed 's/number_of_records/numberOfRecords/' | \
sed 's/total_dmge_amnt/totalDamageSum/' | \
sed 's/hud_unmt_need_amnt/hudUnmetNeedSum/' | \
sed 's/hshd_size_cnt/householdSizeSum/' | \
sed 's/dpndnt_cnt/dependentSum/' | \
sed 's/incm_amnt/incomeSum/' | \
sed 's/hzrd_insnc_amnt/hazardInsuranceSum/' | \
sed 's/flood_insnc_amnt/flowInsuranceSum/' | \
sed 's/other_insnc_amnt/otherInsuranceSum/' | \
sed 's/real_prop_loss_amnt/realPropertyLossSum/' | \
sed 's/flood_dmge_amnt/floodDamageSum/' | \
sed 's/fndtn_dmge_amnt/foundationDamageSum/' | \
sed 's/roof_dmge_amnt/roofDamageSum/' | \
sed 's/tmp_shltr_rcvd_amnt/temporaryShelterReceivedSum/' | \
sed 's/rent_asstn_amnt/rentAssistanceSum/' | \
sed 's/repr_amnt/repairSum/' | \
sed 's/rpmt_amnt/replacementSum/' | \
sed 's/sba_rcvd_amnt/sbaReceivedSum/' | \
sed 's/prsnl_prop_asstn_amnt/personalPropertyAssistanceSum/' | \
sed 's/other_asstn_amnt/otherAssistanceSum/' | \
sed 's/total_asstn_amnt/totalAssistanceSum/'
