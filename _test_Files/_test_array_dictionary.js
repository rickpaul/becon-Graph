

	var Array_Dictionary = function(){
		// Basically a hash table where the key links to an array
		this.dict = {};
	}
	Array_Dictionary.prototype.add = function(key, value) {
		if(!this.dict[key]){
			this.dict[key] = [];
		}
		this.dict[key].push(value);
	};
	Array_Dictionary.prototype.delete = function(key, value) {
		if(!this.dict[key]){
			throw new Error('Key not found');
		}
		this.dict[key].splice(this.dict[key].indexOf(value),1);
		if (this.dict[key].length==0){
			delete this.dict[key];
		}
	};
	Array_Dictionary.prototype.exists = function(key, value) {
		if(!this.dict[key]){
			return false;
		}
		return this.dict[key].indexOf(value) >= 0;
	};