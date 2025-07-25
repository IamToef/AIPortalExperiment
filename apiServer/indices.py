# which index is of which type of products
def get_thresholds(type_obj):
    if type_obj == 'Ensure_Lon_400g':
        lower_thr, upper_thr = 0, 0
    elif type_obj == 'Ensure_Lon_850g':
        lower_thr, upper_thr = 1, 1
    if type_obj == 'PediaSure_Hop_110ml':
        lower_thr, upper_thr = 2, 2
    if type_obj == 'PediaSure_Hop_180ml':
        lower_thr, upper_thr = 3, 3
    elif type_obj == 'PediaSure_Chai_237ml':
        lower_thr, upper_thr = 4, 4
    return lower_thr, upper_thr

def get_indices(boxes):
    ret_dict = {}
    
    def get_indices_helper(lower_thr, upper_thr):
        ret = []
        for i, box in enumerate(boxes):
            if box.label >= lower_thr and box.label <= upper_thr:
                ret.append(i)
        return ret
    for type in ['Ensure_Lon_400g', 'Ensure_Lon_850g', 'PediaSure_Hop_110ml', 'PediaSure_Hop_180ml', 'PediaSure_Chai_237ml']:
        ret_dict.update({f"{type}": get_indices_helper(*get_thresholds(type))})
    return ret_dict