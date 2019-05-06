//materiales sacados de tabla
var material_brass = new Material();
material_brass.set_k_ambient([0.329412,0.223529,0.027451]);
material_brass.set_k_diffuse([0.780392,0.568627,0.113725]);
material_brass.set_k_spec([0.992157,0.941176,0.807843]);
material_brass.set_exp_spec(27.8974);

var material_gold = new Material();
material_gold.set_k_ambient([0.24725,0.1995,0.0745]);
material_gold.set_k_diffuse([0.75164,0.60648,0.22648]);
material_gold.set_k_spec([0.628281,0.555802,0.366065]);
material_gold.set_exp_spec(51.2);

var material_blackplastic = new Material();
material_blackplastic.set_k_ambient([0.0,0.0,0.0]);
material_blackplastic.set_k_diffuse([0.01,0.01,0.01]);
material_blackplastic.set_k_spec([0.5,0.5,0.5]);
material_blackplastic.set_exp_spec(32.0);

var material_silver = new Material();
material_silver.set_k_ambient([0.19225,0.19225,0.19225]);
material_silver.set_k_diffuse([0.50754,0.50754,0.50754]);
material_silver.set_k_spec([0.508273,0.508273,0.508273]);
material_silver.set_exp_spec(51.2);

var material_pearl = new Material();
material_pearl.set_k_ambient([0.25,0.20725,0.20725]);
material_pearl.set_k_diffuse([1.0,0.829,0.829]);
material_pearl.set_k_spec([0.296648,0.296648,0.296648]);
material_pearl.set_exp_spec(11.264);

//material para el plano, totalmente difuso sin especularidad
var material_plano = new Material();
material_plano.set_k_ambient([0.2,0.2,0.2]);
material_plano.set_k_diffuse([0.5,0.5,0.5]);
material_plano.set_k_spec([0.0,0.0,0.0]);
material_plano.set_exp_spec(1.0);