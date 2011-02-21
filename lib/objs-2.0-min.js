var Objs=new function(){this.add=function(l){var p,o,m=arguments[1],r=typeof m,q,n,k;if(typeof l!=d){throw Error("Invalid classpath")
}o=c[l]=function(){var s=arguments.callee;if(!s[e]){if(s[g]){s[g][j]=1;s[g].call(this);delete s[g][j]}if(!s[j]&&s[h][a]){s[h][a].apply(this,arguments)
}}};if(r=="object"){p=m}else{if(r==d){o[g]=Objs.getClass(m)}else{o[g]=m}p=arguments[2]}if(o[g]){if(o[g][h][a]){o[i]=function(B,A,z,y,x,w,v,u,t,s){o[g][h][a].call(B,A,z,y,x,w,v,u,t,s)
}}o[g][e]=1;o[h]=new o[g]();delete o[g][e]}if(p){k=f.slice(0);for(q in p){if(p.hasOwnProperty(q)){k.push(q)}}for(n=0;n<k.length;
n++){q=k[n];o[h][q]=p[q]}}return o};this.getClass=function(k){return c[k]||null};var c={},f=["toString","valueOf","toLocaleString"],d="string",i="$super",h="prototype",a="initialize",b="$Objs$",j=b+"c",e=b+"e",g=b+"s"
};